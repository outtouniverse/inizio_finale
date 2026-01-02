

import React from 'react';
import { BreakDownData } from '../../types';
import Card from '../ui/Card';
import { Skull, AlertTriangle, XCircle, RefreshCcw } from 'lucide-react';

interface Props {
  data: BreakDownData;
}

const BreakDownModule: React.FC<Props> = ({ data }) => {
  return (
    <div className="h-full overflow-y-auto no-scrollbar p-4 md:p-8 bg-black relative">
      
      {/* Glitch Overlay Effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/diagonal-noise.png')]"></div>
      
      <div className="max-w-5xl mx-auto relative z-10">
         
         <div className="mb-12 text-center">
            <div className="inline-block p-3 bg-red-500/10 rounded-full mb-4 border border-red-500/30 animate-pulse">
               <Skull size={32} className="text-red-500" />
            </div>
            <h2 className="text-4xl font-display font-bold text-white mb-2 tracking-tight">System <span className="text-red-500">Crash</span> Test</h2>
            <p className="text-red-400/60 font-mono text-sm">Simulating worst-case scenarios. Brutal honesty mode engaged.</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            
            {/* The VC Reject */}
            <Card className="border-red-500/20 bg-red-950/10 group hover:border-red-500/40 transition-colors">
               <div className="flex items-center space-x-3 mb-4">
                  <XCircle className="text-red-500" size={20} />
                  <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider">The Investor "No"</h3>
               </div>
               <p className="text-xl text-white font-light leading-relaxed italic">"{data.vcDoubt}"</p>
            </Card>

            {/* The Customer Skeptic */}
            <Card className="border-orange-500/20 bg-orange-950/10 group hover:border-orange-500/40 transition-colors">
               <div className="flex items-center space-x-3 mb-4">
                  <AlertTriangle className="text-orange-500" size={20} />
                  <h3 className="text-sm font-bold text-orange-400 uppercase tracking-wider">The Customer Doubt</h3>
               </div>
               <p className="text-xl text-white font-light leading-relaxed italic">"{data.customerFeeling}"</p>
            </Card>

         </div>

         {/* Weaknesses & Blindspots */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="space-y-4">
               <h3 className="text-white font-bold flex items-center"><span className="w-1.5 h-6 bg-red-500 mr-3"></span> Structural Weaknesses</h3>
               {data.weaknesses.map((w, i) => (
                  <div key={i} className="p-4 bg-white/5 border-l-2 border-l-red-500/50 border-y border-r border-white/5 rounded-r-lg text-gray-300">
                     {w}
                  </div>
               ))}
            </div>
            <div className="space-y-4">
               <h3 className="text-white font-bold flex items-center"><span className="w-1.5 h-6 bg-orange-500 mr-3"></span> Strategic Blindspots</h3>
               {data.blindSpots.map((b, i) => (
                  <div key={i} className="p-4 bg-white/5 border-l-2 border-l-orange-500/50 border-y border-r border-white/5 rounded-r-lg text-gray-300">
                     {b}
                  </div>
               ))}
            </div>
         </div>

         {/* The Core Contradiction */}
         <div className="p-8 rounded-2xl bg-gradient-to-r from-white/5 to-transparent border border-white/10 text-center mb-12">
            <h3 className="text-sm font-mono text-text-muted uppercase mb-4">Core Logic Error</h3>
            <p className="text-2xl text-white font-medium">"{data.contradictions}"</p>
         </div>

         {/* Recovery Plan (The Hope) */}
         <div className="relative p-8 rounded-2xl border border-green-500/20 bg-green-900/5 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-green-500/50"></div>
            <div className="flex items-start gap-6">
               <div className="p-3 bg-green-500/10 rounded-lg text-green-400">
                  <RefreshCcw size={24} />
               </div>
               <div>
                  <h3 className="text-xl font-bold text-white mb-2">Recovery Path</h3>
                  <p className="text-green-100/80 leading-relaxed">{data.recoveryPlan}</p>
               </div>
            </div>
         </div>

      </div>
    </div>
  );
};

export default BreakDownModule;
