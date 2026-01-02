
import React, { useState } from 'react';
import { TimelineData } from '../../types';
import Card from '../ui/Card';
import { GitBranch, Flag, AlertCircle, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  data: TimelineData;
}

const TimelineModule: React.FC<Props> = ({ data }) => {
  const [activeScenario, setActiveScenario] = useState<number>(0);

  const scenario = data.scenarios[activeScenario];
  
  // Colors for scenarios
  const getColors = (index: number) => {
      if (index === 0) return { border: 'border-blue-500', text: 'text-blue-500', bg: 'bg-blue-500' }; // Conservative
      if (index === 1) return { border: 'border-green-500', text: 'text-green-500', bg: 'bg-green-500' }; // Smart
      return { border: 'border-purple-500', text: 'text-purple-500', bg: 'bg-purple-500' }; // Insane
  };

  const activeColors = getColors(activeScenario);

  return (
    <div className="h-full flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden relative">
       
       {/* Left: Timeline Selection */}
       <div className="w-full lg:w-80 bg-black/50 lg:border-r border-b lg:border-b-0 border-white/5 p-4 md:p-6 flex flex-col flex-none">
          <h2 className="text-2xl font-display font-bold text-white mb-6">Future <span className="text-primary">Paths</span></h2>
          <div className="space-y-4 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
             {data.scenarios.map((s, i) => {
                const cols = getColors(i);
                const isActive = i === activeScenario;
                return (
                   <button 
                      key={i}
                      onClick={() => setActiveScenario(i)}
                      className={`w-full text-left p-4 rounded-xl border transition-all duration-300 group relative overflow-hidden ${
                          isActive ? `bg-white/10 ${cols.border}` : 'bg-transparent border-white/10 hover:bg-white/5'
                      }`}
                   >
                      {isActive && <div className={`absolute left-0 top-0 bottom-0 w-1 ${cols.bg}`}></div>}
                      <div className="flex justify-between items-center mb-1">
                         <h3 className={`font-bold ${isActive ? 'text-white' : 'text-gray-400'}`}>{s.name}</h3>
                         <span className="text-xs font-mono text-text-muted">{s.probability}% Prob</span>
                      </div>
                      <p className="text-xs text-text-muted line-clamp-2 opacity-70 hidden sm:block">{s.description}</p>
                   </button>
                )
             })}
          </div>
       </div>

       {/* Right: Visualization */}
       <div className="flex-1 p-4 md:p-6 lg:p-12 overflow-y-auto relative bg-[#050505]">
          {/* Fog */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#050505] pointer-events-none z-10"></div>
          
          <AnimatePresence mode="wait">
             <motion.div 
               key={activeScenario}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               transition={{ duration: 0.4 }}
               className="max-w-4xl mx-auto pb-20"
             >
                {/* Header */}
                <div className="flex items-end justify-between mb-8 md:mb-12 border-b border-white/10 pb-6">
                   <div>
                      <div className={`text-sm font-mono uppercase tracking-widest mb-2 ${activeColors.text}`}>Projected Trajectory</div>
                      <h2 className="text-3xl md:text-5xl font-display font-bold text-white">{scenario.name} Path</h2>
                   </div>
                   <div className="text-right hidden sm:block">
                      <div className="text-xs text-text-muted uppercase mb-1">12-Month Forecast</div>
                      <div className="text-2xl font-bold text-white">{scenario.revenueProjection}</div>
                   </div>
                </div>

                <div className="sm:hidden mb-8 p-4 bg-white/5 rounded-lg border border-white/10 text-center">
                    <div className="text-xs text-text-muted uppercase mb-1">Forecast</div>
                    <div className="text-2xl font-bold text-white">{scenario.revenueProjection}</div>
                </div>

                {/* The Curve Visualization (CSS/SVG) */}
                <div className="relative h-48 md:h-64 mb-12 w-full">
                   <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                      {/* Grid Lines */}
                      <line x1="0" y1="100%" x2="100%" y2="100%" stroke="#333" strokeWidth="1" />
                      <line x1="0" y1="0" x2="0" y2="100%" stroke="#333" strokeWidth="1" />
                      
                      {/* The Curve */}
                      <path 
                         d={`M0,256 C100,256 300,${activeScenario === 2 ? '0' : activeScenario === 1 ? '100' : '180'} 800,${activeScenario === 2 ? '-50' : activeScenario === 1 ? '50' : '150'}`}
                         fill="none"
                         stroke={activeScenario === 2 ? '#A855F7' : activeScenario === 1 ? '#22C55E' : '#3B82F6'}
                         strokeWidth="4"
                         className="drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                      />
                      
                      {/* Area fill under curve - simplified */}
                      <path 
                         d={`M0,256 C100,256 300,${activeScenario === 2 ? '0' : activeScenario === 1 ? '100' : '180'} 800,${activeScenario === 2 ? '-50' : activeScenario === 1 ? '50' : '150'} L800,256 Z`}
                         fill={`url(#grad-${activeScenario})`}
                         opacity="0.2"
                      />
                      
                      <defs>
                        <linearGradient id={`grad-${activeScenario}`} x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor={activeScenario === 2 ? '#A855F7' : activeScenario === 1 ? '#22C55E' : '#3B82F6'} />
                          <stop offset="100%" stopColor="black" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                   </svg>
                   
                   {/* Interactive Nodes overlaid on CSS estimation */}
                   <div className="absolute top-[60%] left-[20%] group cursor-pointer">
                      <div className={`w-4 h-4 rounded-full border-2 border-black ${activeColors.bg} shadow-[0_0_15px_currentColor]`}></div>
                      <div className="absolute top-6 left-1/2 -translate-x-1/2 w-32 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <div className="text-xs font-bold text-white bg-black/80 px-2 py-1 rounded border border-white/10">Launch</div>
                      </div>
                   </div>

                   <div className="absolute top-[30%] left-[60%] group cursor-pointer">
                      <div className={`w-4 h-4 rounded-full border-2 border-black ${activeColors.bg} shadow-[0_0_15px_currentColor]`}></div>
                       <div className="absolute top-6 left-1/2 -translate-x-1/2 w-32 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <div className="text-xs font-bold text-white bg-black/80 px-2 py-1 rounded border border-white/10">Traction</div>
                      </div>
                   </div>
                </div>

                {/* Milestones & Obstacles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <Card>
                      <h3 className="text-white font-bold flex items-center mb-4"><Flag className="mr-2 text-white" size={18} /> Key Milestones</h3>
                      <div className="space-y-3">
                         {scenario.milestones.map((m, i) => (
                            <div key={i} className="flex items-center p-3 bg-white/5 rounded-lg border border-white/5">
                               <div className={`w-6 h-6 rounded-full ${activeColors.bg} bg-opacity-20 text-xs flex items-center justify-center mr-3 ${activeColors.text} font-bold`}>
                                  {i + 1}
                               </div>
                               <span className="text-gray-300 text-sm">{m}</span>
                            </div>
                         ))}
                      </div>
                   </Card>

                   <Card>
                      <h3 className="text-white font-bold flex items-center mb-4"><AlertCircle className="mr-2 text-red-400" size={18} /> Predicted Obstacles</h3>
                      <div className="space-y-3">
                         {scenario.obstacles.map((o, i) => (
                            <div key={i} className="flex items-center p-3 bg-red-900/10 rounded-lg border border-red-500/10">
                               <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-3"></div>
                               <span className="text-gray-300 text-sm">{o}</span>
                            </div>
                         ))}
                      </div>
                   </Card>
                </div>

             </motion.div>
          </AnimatePresence>
       </div>
    </div>
  );
};

export default TimelineModule;
