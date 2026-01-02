
import React, { useState } from 'react';
import { GeoData } from '../../types';
import { Globe, Map, Users, DollarSign, Zap, ArrowRight, CheckCircle } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface Props {
  data: GeoData;
}

const GeoModule: React.FC<Props> = ({ data }) => {
  const [mode, setMode] = useState<'INPUT' | 'ANALYSIS'>('INPUT');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setMode('ANALYSIS');
    }, 2000);
  };

  return (
    <div className="h-full overflow-y-auto no-scrollbar relative">
      
      {/* Cinematic Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px]"></div>
      </div>

      {mode === 'INPUT' && (
        <div className="h-full flex flex-col items-center justify-center relative z-10 px-4 md:px-6">
          <div className="text-center mb-8 md:mb-12">
             <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">Geo Intelligence</h2>
             <p className="text-text-muted max-w-lg mx-auto text-sm md:text-base">Where does your startup actually belong? Our strategy engine analyzes demographics, regulations, and market depth.</p>
          </div>

          {loading ? (
             <div className="flex flex-col items-center">
                <div className="w-48 h-48 md:w-64 md:h-64 rounded-full border border-primary/30 border-t-primary animate-spin mb-8 relative flex items-center justify-center">
                   <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border border-dashed border-white/20 animate-spin-slow-reverse"></div>
                   <Globe size={48} className="text-primary absolute animate-pulse" />
                </div>
                <div className="text-primary font-mono tracking-widest text-xs uppercase animate-pulse">Scanning Global Markets...</div>
             </div>
          ) : (
            <div className="w-full max-w-2xl bg-surface/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl animate-slide-up">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-text-muted uppercase">Target Audience</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-primary outline-none">
                      <option>Gen Z / Creators</option>
                      <option>Enterprise B2B</option>
                      <option>SME / Local</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-text-muted uppercase">Budget Range</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-primary outline-none">
                      <option>Bootstrapped ($0 - $5k)</option>
                      <option>Seed ($50k - $500k)</option>
                      <option>Series A ($1M+)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-text-muted uppercase">Model</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-primary outline-none">
                      <option>B2B SaaS</option>
                      <option>Consumer App</option>
                      <option>Marketplace</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-text-muted uppercase">Launch Timeline</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-primary outline-none">
                      <option>ASAP (1 month)</option>
                      <option>Q3 2025</option>
                      <option>2026</option>
                    </select>
                  </div>
               </div>
               <Button variant="primary" size="lg" className="w-full group" onClick={handleAnalyze}>
                 Initialize Geo Scan <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
               </Button>
            </div>
          )}
        </div>
      )}

      {mode === 'ANALYSIS' && (
        <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-8 p-4 md:p-6 pt-8 md:pt-12 relative z-10 overflow-y-auto">
           
           {/* Left: The Cinematic Globe */}
           <div className="col-span-12 lg:col-span-7 flex items-center justify-center relative min-h-[300px] md:min-h-[400px]">
              <div className="relative w-[260px] h-[260px] md:w-[450px] md:h-[450px]">
                 {/* CSS 3D Globe Effect */}
                 <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#1a237e] to-black opacity-80 blur-md"></div>
                 <div className="absolute inset-0 rounded-full border border-primary/30 shadow-[0_0_50px_rgba(46,199,255,0.3)]"></div>
                 
                 {/* Rotating Grid */}
                 <div className="absolute inset-0 rounded-full overflow-hidden opacity-30 animate-spin-slow">
                    <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] bg-cover"></div>
                 </div>
                 
                 {/* Pulsing Hotspots */}
                 <div className="absolute top-[30%] left-[40%] w-4 h-4 bg-primary rounded-full animate-ping"></div>
                 <div className="absolute top-[30%] left-[40%] w-2 h-2 bg-white rounded-full"></div>
                 <div className="absolute top-[25%] left-[42%] text-[10px] font-mono text-white bg-black/50 px-2 py-0.5 rounded border border-primary/30">
                    {data.region} (98%)
                 </div>
              </div>
           </div>

           {/* Right: Data Panel */}
           <div className="col-span-12 lg:col-span-5 space-y-6 animate-slide-up pb-20">
              <div>
                 <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    <span className="text-xs font-mono text-primary uppercase tracking-widest">Optimal Region Detected</span>
                 </div>
                 <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-2">{data.region}</h2>
                 <p className="text-text-muted text-sm md:text-base">{data.reason}</p>
              </div>

              <Card className="bg-gradient-to-r from-primary/10 to-transparent border-primary/20">
                 <div className="flex justify-between items-center mb-4">
                    <span className="font-mono text-sm text-white uppercase">Launchability Score</span>
                    <span className="text-2xl font-bold text-primary">92/100</span>
                 </div>
                 <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[92%] animate-pulse"></div>
                 </div>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                 <DataCard icon={Users} label="TAM" value={data.tam} />
                 <DataCard icon={Zap} label="Complexity" value={data.complexity} />
                 <DataCard icon={DollarSign} label="CAC Est." value="$12.50" />
                 <DataCard icon={Map} label="Density" value="High" />
              </div>

              <div className="space-y-3">
                 <h4 className="text-sm font-mono text-text-muted uppercase tracking-wider">Strategy Blueprint</h4>
                 <StrategyItem text="Leverage high mobile penetration." />
                 <StrategyItem text="Partner with local payment gateways." />
                 <StrategyItem text="Focus on localized content marketing." />
              </div>
           </div>

        </div>
      )}
    </div>
  );
};

const DataCard = ({ icon: Icon, label, value }: any) => (
  <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex flex-col justify-center">
     <Icon size={16} className="text-text-muted mb-2" />
     <span className="text-[10px] font-mono text-text-muted uppercase">{label}</span>
     <span className="text-lg font-bold text-white">{value}</span>
  </div>
);

const StrategyItem = ({ text }: { text: string }) => (
  <div className="flex items-center space-x-3 p-3 bg-surface rounded border border-white/5">
     <CheckCircle size={14} className="text-secondary" />
     <span className="text-sm text-white">{text}</span>
  </div>
);

export default GeoModule;
