
import React from 'react';
import Card from '../ui/Card';
import { MVPBlock } from '../../types';
import { Box, Database, Lock, Shield, Cpu, Layers } from 'lucide-react';

interface Props {
  data: MVPBlock[];
}

const MVPModule: React.FC<Props> = ({ data }) => {
  return (
    <div className="h-full overflow-y-auto no-scrollbar p-4 md:p-8">
      <div className="max-w-7xl mx-auto pb-12">
        <div className="mb-8 md:mb-12">
           <h3 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">Build <span className="text-secondary">Forge</span></h3>
           <p className="text-text-muted max-w-xl text-sm md:text-base">
             Core manufacturing specs for V1. Prioritized by complexity and value.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {data.map((block, idx) => (
             <div 
               key={block.id} 
               className="relative group perspective-container"
               style={{ animationDelay: `${idx * 100}ms` }}
             >
               <div className="absolute -inset-0.5 bg-gradient-to-b from-primary/20 to-secondary/20 rounded-xl opacity-0 group-hover:opacity-100 blur transition duration-500"></div>
               <Card className="relative h-full bg-[#0E0E0F] border border-white/10 group-hover:border-white/30 transition-colors cube-hover">
                  {/* Tech Header */}
                  <div className="flex justify-between items-start mb-4">
                     <div className="p-2 bg-white/5 rounded border border-white/10 text-white group-hover:text-primary transition-colors">
                        {block.category === 'Auth' && <Lock size={18} />}
                        {block.category === 'Core' && <Box size={18} />}
                        {block.category === 'Data' && <Database size={18} />}
                        {block.category === 'Admin' && <Shield size={18} />}
                        {(!['Auth','Core','Data','Admin'].includes(block.category)) && <Cpu size={18} />}
                     </div>
                     <div className="flex flex-col items-end">
                       <span className="text-[10px] font-mono text-text-muted uppercase">Complexity</span>
                       <div className="flex space-x-1 mt-1">
                          <div className={`w-2 h-1 rounded-sm ${['Low','Medium','High'].includes(block.complexity) ? 'bg-primary' : 'bg-white/10'}`}></div>
                          <div className={`w-2 h-1 rounded-sm ${['Medium','High'].includes(block.complexity) ? 'bg-primary' : 'bg-white/10'}`}></div>
                          <div className={`w-2 h-1 rounded-sm ${['High'].includes(block.complexity) ? 'bg-primary' : 'bg-white/10'}`}></div>
                       </div>
                     </div>
                  </div>

                  <h3 className="text-lg md:text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{block.name}</h3>
                  <p className="text-sm text-text-muted leading-relaxed">{block.description}</p>
                  
                  {/* Footer Decoration */}
                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-text-dim">
                     <span>MOD-{String(idx + 1).padStart(3, '0')}</span>
                     <Cpu size={14} />
                  </div>
               </Card>
             </div>
          ))}
          
          {/* Locked Future Sprints */}
          <div className="rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center min-h-[200px] opacity-40 hover:opacity-60 transition-opacity p-8">
             <Layers size={32} className="text-text-muted mb-2" />
             <span className="text-xs font-mono uppercase tracking-widest text-text-muted">Sprint 2 Locked</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MVPModule;
