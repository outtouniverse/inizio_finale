
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Globe, Loader2, ArrowRight, Sliders, ExternalLink } from 'lucide-react';
import { FinderResult } from '../../types';
import { streamUserFinder } from '../../services/finderService';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface Props {
  onClose: () => void;
}

const UserFinder: React.FC<Props> = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<FinderResult[]>([]);
  const [activePlatform, setActivePlatform] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleScan = async () => {
    if (!query.trim()) return;
    setIsScanning(true);
    setHasSearched(true);
    setResults([]); // Clear previous
    setActivePlatform("Initializing...");

    try {
        // Consume the generator stream
        for await (const batch of streamUserFinder(query)) {
            setActivePlatform(batch.platform);
            setResults(prev => [...prev, ...batch.results]);
        }
    } catch (e) {
        console.error("Scan failed", e);
    } finally {
        setIsScanning(false);
        setActivePlatform(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[90] bg-[#050505] flex flex-col animate-fade-in">
       
       {/* Header */}
       <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#0A0A0C]">
          <div className="flex items-center gap-3">
             <Globe className="text-primary" size={20} />
             <h1 className="text-white font-bold text-lg">User Finder <span className="text-xs font-mono font-normal text-primary border border-primary/20 px-2 py-0.5 rounded bg-primary/10 ml-2">LIVE SCAN</span></h1>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-white">Close</button>
       </div>

       <div className="flex-1 flex overflow-hidden">
          
          {/* Main Content */}
          <div className="flex-1 p-8 overflow-y-auto relative scroll-smooth">
             
             {/* Search Hero */}
             <div className={`max-w-3xl mx-auto transition-all duration-500 ${hasSearched ? 'mt-0 mb-8' : 'mt-32'}`}>
                <h2 className={`text-4xl font-display font-bold text-white mb-6 text-center transition-all ${hasSearched ? 'text-2xl mb-4 text-left' : ''}`}>
                   {hasSearched ? 'Live Results' : <span>Find your <span className="text-primary">early adopters.</span></span>}
                </h2>
                
                <div className="relative group">
                   <div className={`absolute inset-0 bg-primary/20 rounded-2xl blur-xl transition-opacity ${isScanning ? 'opacity-100 animate-pulse' : 'opacity-0 group-hover:opacity-50'}`}></div>
                   <div className="relative bg-[#121214] border border-white/10 rounded-2xl p-2 flex items-center shadow-2xl">
                      <Search className={`text-text-muted ml-4 ${isScanning ? 'animate-spin text-primary' : ''}`} size={24} />
                      <input 
                        type="text" 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="e.g. People complaining about slow Jira alternatives..."
                        className="flex-1 bg-transparent border-none text-white text-lg px-4 py-4 focus:outline-none placeholder:text-text-muted/50"
                        onKeyDown={(e) => e.key === 'Enter' && !isScanning && handleScan()}
                        disabled={isScanning}
                      />
                      <Button 
                        onClick={handleScan} 
                        disabled={isScanning || !query}
                        className="px-8 py-4 rounded-xl"
                      >
                         {isScanning ? <span className="flex items-center gap-2 text-xs uppercase tracking-widest">Scanning {activePlatform}...</span> : <ArrowRight />}
                      </Button>
                   </div>
                </div>

                {/* Visual Scanner Graph (Only during scan or initial state) */}
                {!hasSearched && (
                   <div className="mt-16 flex justify-center relative h-64">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow-[0_0_20px_var(--primary)] z-10"></div>
                      {[...Array(6)].map((_, i) => (
                         <div 
                           key={i}
                           className="absolute w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center animate-float"
                           style={{
                              top: `${50 + 30 * Math.sin(i)}%`,
                              left: `${50 + 30 * Math.cos(i)}%`,
                              animationDelay: `${i * 0.5}s`
                           }}
                         >
                            <div className="w-2 h-2 bg-white/20 rounded-full"></div>
                         </div>
                      ))}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                         {[...Array(6)].map((_, i) => (
                            <line key={i} x1="50%" y1="50%" x2={`${50 + 30 * Math.cos(i)}%`} y2={`${50 + 30 * Math.sin(i)}%`} stroke="white" strokeWidth="1" />
                         ))}
                      </svg>
                   </div>
                )}
             </div>

             {/* Results Grid */}
             <div className="max-w-5xl mx-auto space-y-4">
                <AnimatePresence>
                   {results.map((result, i) => (
                      <motion.div 
                        key={result.id}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 100, damping: 15 }}
                      >
                         <Card className="flex flex-col md:flex-row gap-6 group hover:border-primary/30 transition-colors">
                            <div className="flex-1">
                               <div className="flex items-center gap-3 mb-2">
                                  <span className={`text-xs font-bold px-2 py-1 rounded border ${
                                     result.platform === 'Reddit' ? 'border-orange-500/30 text-orange-500 bg-orange-500/10' :
                                     result.platform === 'X (Twitter)' ? 'border-blue-400/30 text-blue-400 bg-blue-400/10' :
                                     result.platform === 'YouTube' ? 'border-red-500/30 text-red-500 bg-red-500/10' :
                                     'border-white/20 text-white bg-white/10'
                                  }`}>
                                     {result.platform}
                                  </span>
                                  <span className="text-text-muted text-sm font-mono">@{result.username}</span>
                                  <span className="text-text-dim text-xs">• {result.date}</span>
                                  {result.sentiment === 'Negative' && (
                                      <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded ml-auto">Complaint</span>
                                  )}
                               </div>
                               <p className="text-white/90 leading-relaxed text-base">"{result.snippet}"</p>
                            </div>
                            
                            <div className="w-full md:w-48 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6 flex flex-col justify-center gap-2">
                               <div className="flex items-center justify-between text-xs text-text-muted mb-1">
                                  <span>Relevance</span>
                                  <span className="text-primary font-bold">{result.relevance}%</span>
                               </div>
                               <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-4">
                                  <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${result.relevance}%` }}></div>
                               </div>
                               <div className="flex gap-2">
                                  <button className="flex-1 py-2 rounded bg-white/5 hover:bg-white/10 text-xs font-bold text-white border border-white/10 flex items-center justify-center gap-1">
                                     DM
                                  </button>
                                  <button className="flex-1 py-2 rounded bg-primary text-black text-xs font-bold hover:opacity-90 flex items-center justify-center gap-1">
                                     Open <ExternalLink size={10} />
                                  </button>
                               </div>
                            </div>
                         </Card>
                      </motion.div>
                   ))}
                </AnimatePresence>
                
                {isScanning && (
                   <div className="py-8 flex justify-center">
                      <Loader2 className="animate-spin text-primary" size={32} />
                   </div>
                )}
             </div>

          </div>

          {/* Right Sidebar: Filters */}
          <div className="w-72 bg-[#0A0A0C] border-l border-white/10 p-6 hidden xl:block">
             <div className="flex items-center gap-2 text-white font-bold mb-6">
                <Sliders size={18} /> Live Filters
             </div>
             
             <div className="space-y-6">
                <div className="space-y-2">
                   <label className="text-xs text-text-muted uppercase">Platforms</label>
                   <div className="space-y-1">
                      {['Reddit', 'Twitter', 'LinkedIn', 'IndieHackers', 'YouTube'].map(p => (
                         <label key={p} className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer hover:text-white">
                            <input type="checkbox" defaultChecked className="rounded border-white/20 bg-transparent accent-primary" />
                            {p}
                         </label>
                      ))}
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-xs text-text-muted uppercase">Intent Level</label>
                   <select className="w-full bg-white/5 border border-white/10 rounded p-2 text-sm text-white">
                      <option>High (Complaints/Requests)</option>
                      <option>Medium (Questions)</option>
                      <option>All</option>
                   </select>
                </div>
             </div>
          </div>

       </div>
    </div>
  );
};

export default UserFinder;
