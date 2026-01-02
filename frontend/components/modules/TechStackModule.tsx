
import React, { useState } from 'react';
import Card from '../ui/Card';
import { TechStackData, TechStackSection, TechStackTool } from '../../types';
import { 
  Cpu, 
  Layers, 
  Zap, 
  Box, 
  Server, 
  Palette, 
  Activity, 
  DollarSign, 
  Clock, 
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  data: TechStackData;
}

const TechStackModule: React.FC<Props> = ({ data }) => {
  const isEmpty = !data || !data.core || !data.core.tools || data.core.tools.length === 0;

  if (isEmpty) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-6">
         <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/10 animate-pulse">
            <Layers size={32} className="text-text-muted" />
         </div>
         <div>
            <h2 className="text-2xl font-bold text-white mb-2">Architecting Blueprint...</h2>
            <p className="text-text-muted max-w-md mx-auto">
               We haven't detected a specific build type yet. Please restart the analysis.
            </p>
         </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto no-scrollbar p-4 md:p-8 bg-black/40">
      <div className="max-w-6xl mx-auto space-y-8 md:space-y-12 pb-20">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
           <div className="animate-slide-up w-full">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                 <span className="px-3 py-1 rounded bg-primary/10 border border-primary/20 text-primary text-xs font-mono font-bold uppercase tracking-widest">
                    {data.category || "General Tech"}
                 </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-2">Tech Stack <span className="text-white/40">Blueprint</span></h2>
              <p className="text-base md:text-lg text-text-muted max-w-2xl font-light leading-relaxed">
                 {data.description}
              </p>
           </div>

           {/* Difficulty Meter */}
           <div className="bg-white/5 border border-white/10 rounded-xl p-4 w-full lg:w-auto min-w-[200px] animate-slide-up flex-none">
              <div className="text-[10px] font-mono uppercase text-text-muted mb-2 flex justify-between">
                 <span>Complexity</span>
                 <span className="text-white font-bold">{data.metrics.difficulty}/4</span>
              </div>
              <div className="flex space-x-1 h-2">
                 {[1, 2, 3, 4].map((level) => (
                    <div 
                      key={level} 
                      className={`flex-1 rounded-sm ${level <= data.metrics.difficulty ? 'bg-primary shadow-[0_0_10px_var(--primary)]' : 'bg-white/10'}`}
                    ></div>
                 ))}
              </div>
           </div>
        </div>

        {/* --- CORE STACK (HERO SECTION) --- */}
        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
           <h3 className="text-lg md:text-xl font-bold text-white mb-6 flex items-center">
              <Layers className="mr-3 text-primary" size={24} /> 1. {data.core.title || "Core Build Stack"}
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {data.core.tools.map((tool, i) => (
                 <ToolCard key={i} tool={tool} index={i} type="core" />
              ))}
              {/* Reasoning Box */}
              {data.core.reasoning && (
                 <div className="md:col-span-2 lg:col-span-3 p-4 bg-primary/5 border border-primary/10 rounded-lg flex items-start space-x-3">
                    <div className="bg-primary/20 p-1.5 rounded-full mt-0.5 flex-shrink-0">
                       <Zap size={14} className="text-primary" />
                    </div>
                    <p className="text-sm text-white/80 italic">{data.core.reasoning}</p>
                 </div>
              )}
           </div>
        </div>

        {/* --- SECONDARY STACKS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 animate-slide-up" style={{ animationDelay: '0.3s' }}>
           <StackSection title="2. AI & Automation" icon={Cpu} tools={data.ai.tools} />
           <StackSection title="3. Brand & Content" icon={Palette} tools={data.brand.tools} />
           <StackSection title="4. Ops & Growth" icon={Activity} tools={data.ops.tools} />
           <StackSection title="5. Infra & DevOps" icon={Server} tools={data.infra.tools} />
        </div>

        {/* --- BUDGET TIERS --- */}
        <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
           <h3 className="text-lg md:text-xl font-bold text-white mb-6 flex items-center">
              <DollarSign className="mr-3 text-green-400" size={24} /> 6. Budget Modes
           </h3>
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
              <BudgetCard tier="Lean" cost={data.budget.lean} desc="MVP" color="border-white/10" />
              <BudgetCard tier="Balanced" cost={data.budget.balanced} desc="Growth" color="border-primary/50 bg-primary/5" highlight />
              <BudgetCard tier="Premium" cost={data.budget.premium} desc="Scale" color="border-purple-500/30 bg-purple-500/5" />
           </div>
        </div>

        {/* --- TIMELINE & ACTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slide-up" style={{ animationDelay: '0.5s' }}>
           
           {/* Timeline */}
           <div className="lg:col-span-2 p-6 bg-white/5 border border-white/10 rounded-2xl">
              <h3 className="text-sm font-mono uppercase text-text-muted mb-6 flex items-center">
                 <Clock size={16} className="mr-2" /> Execution Timeline
              </h3>
              <div className="space-y-6 relative pl-2">
                 <div className="absolute left-[13px] top-2 bottom-2 w-[1px] bg-white/10"></div>
                 {data.metrics.timeline.map((phase, i) => (
                    <div key={i} className="flex items-start space-x-4 relative">
                       <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold z-10 ${i === 0 ? 'bg-primary text-black' : 'bg-white/10 text-text-muted'}`}>
                          {i + 1}
                       </div>
                       <div className="pt-0.5">
                          <p className="text-sm text-white font-medium">{phase}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           {/* Micro Recommendations */}
           <div className="p-6 bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-2xl flex flex-col justify-between">
              <div>
                 <h3 className="text-sm font-mono uppercase text-primary mb-4 flex items-center font-bold">
                    <Zap size={16} className="mr-2" /> Start Here
                 </h3>
                 <p className="text-white text-lg font-bold mb-2">"{data.recommendation.now}"</p>
                 <p className="text-xs text-text-muted mb-6">Immediate First Step</p>
              </div>
              
              <div className="pt-6 border-t border-white/10">
                 <h3 className="text-[10px] font-mono uppercase text-text-muted mb-2">Later Upgrade</h3>
                 <p className="text-sm text-white/80">"{data.recommendation.later}"</p>
              </div>
           </div>

        </div>

      </div>
    </div>
  );
};

// --- Sub-components ---

interface ToolCardProps {
  tool: TechStackTool;
  index: number;
  type?: 'core';
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, index, type }) => (
  <Card className={`group flex flex-col h-full border-white/10 hover:border-white/30 transition-all duration-300 ${type === 'core' ? 'bg-white/5' : 'bg-transparent'}`}>
     <div className="flex items-center justify-between mb-3">
        <h4 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{tool.name}</h4>
        {type === 'core' && index === 0 && (
           <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded font-bold uppercase">Primary</span>
        )}
     </div>
     <p className="text-sm text-text-muted leading-relaxed">{tool.desc}</p>
  </Card>
);

const StackSection = ({ title, icon: Icon, tools }: any) => {
   const [isOpen, setIsOpen] = useState(true);

   return (
      <div className="flex flex-col">
         <button 
           onClick={() => setIsOpen(!isOpen)}
           className="flex items-center justify-between w-full mb-4 group"
         >
            <h3 className="text-lg font-bold text-white flex items-center group-hover:text-primary transition-colors">
               <Icon className="mr-3 text-text-muted group-hover:text-primary transition-colors" size={20} /> {title}
            </h3>
            {isOpen ? <ChevronUp size={16} className="text-text-muted"/> : <ChevronDown size={16} className="text-text-muted"/>}
         </button>
         
         <AnimatePresence>
            {isOpen && (
               <motion.div 
                 initial={{ height: 0, opacity: 0 }}
                 animate={{ height: 'auto', opacity: 1 }}
                 exit={{ height: 0, opacity: 0 }}
                 className="overflow-hidden"
               >
                  <div className="space-y-3 pl-4 md:pl-8 border-l border-white/10">
                     {tools.map((tool: TechStackTool, i: number) => (
                        <div key={i} className="flex items-baseline space-x-3">
                           <span className="w-1.5 h-1.5 rounded-full bg-white/20 mt-1.5 flex-shrink-0"></span>
                           <div>
                              <span className="text-sm text-white font-bold mr-2">{tool.name}</span>
                              <span className="text-xs text-text-muted">{tool.desc}</span>
                           </div>
                        </div>
                     ))}
                     {tools.length === 0 && <span className="text-xs text-text-muted italic">Not required.</span>}
                  </div>
               </motion.div>
            )}
         </AnimatePresence>
      </div>
   );
}

const BudgetCard = ({ tier, cost, desc, color, highlight }: any) => (
   <div className={`p-4 md:p-6 rounded-xl border ${color} flex flex-col items-center text-center relative overflow-hidden transition-transform duration-300 hover:scale-[1.02]`}>
      {highlight && <div className="absolute top-0 inset-x-0 h-1 bg-primary"></div>}
      <h4 className="text-sm font-mono uppercase text-text-muted mb-2">{tier}</h4>
      <div className="text-xl md:text-2xl font-bold text-white mb-1">{cost}</div>
      <p className="text-xs text-white/50">{desc}</p>
   </div>
);

export default TechStackModule;
