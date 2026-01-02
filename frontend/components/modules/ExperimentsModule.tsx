

import React from 'react';
import { ExperimentData } from '../../types';
import Card from '../ui/Card';
import { FlaskConical, Clock, DollarSign, Gauge, ChevronRight } from 'lucide-react';

interface Props {
  data: ExperimentData;
}

const ExperimentsModule: React.FC<Props> = ({ data }) => {
  return (
    <div className="h-full overflow-y-auto no-scrollbar p-4 md:p-8">
       <div className="max-w-6xl mx-auto">
          
          <div className="mb-10 flex justify-between items-end">
             <div>
                <h2 className="text-4xl font-display font-bold text-white mb-2">Testing <span className="text-secondary">Lab</span></h2>
                <p className="text-text-muted">Rapid validation protocols to run in &lt; 48 hours.</p>
             </div>
             <div className="hidden md:flex items-center gap-2 text-xs font-mono text-secondary border border-secondary/20 bg-secondary/5 px-3 py-1.5 rounded">
                <FlaskConical size={14} />
                <span>LAB STATUS: ACTIVE</span>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {data.experiments.map((exp, i) => (
                <div key={i} className="group perspective-container">
                   <Card className="h-full flex flex-col hover:-translate-y-2 transition-transform duration-500 border-white/10 hover:border-secondary/40 cube-hover">
                      
                      <div className="flex justify-between items-start mb-6">
                         <span className="text-[10px] font-bold uppercase px-2 py-1 rounded bg-white/10 text-white border border-white/10">
                            {exp.type}
                         </span>
                         <div className="flex items-center space-x-1 text-secondary">
                            <Gauge size={14} />
                            <span className="text-xs font-bold">{exp.impact}/10</span>
                         </div>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-4 group-hover:text-secondary transition-colors">
                         {exp.name}
                      </h3>

                      <div className="flex items-center gap-4 text-xs text-text-muted mb-6 border-b border-white/5 pb-6">
                         <div className="flex items-center gap-1">
                            <Clock size={12} /> {exp.duration}
                         </div>
                         <div className="flex items-center gap-1">
                            <DollarSign size={12} /> {exp.cost}
                         </div>
                         <div className="px-1.5 py-0.5 rounded bg-white/5 border border-white/5 uppercase text-[9px]">
                            {exp.difficulty}
                         </div>
                      </div>

                      <div className="space-y-3 flex-1">
                         <p className="text-xs font-mono text-text-muted uppercase mb-2">Protocol Steps</p>
                         {exp.steps.map((step, s) => (
                            <div key={s} className="flex items-start text-sm text-gray-300 group/step">
                               <span className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-[10px] text-text-muted mr-3 group-hover/step:bg-secondary/20 group-hover/step:text-secondary transition-colors">
                                  {s + 1}
                               </span>
                               <span className="leading-snug">{step}</span>
                            </div>
                         ))}
                      </div>

                      <button className="mt-8 w-full py-2.5 bg-white/5 hover:bg-secondary/10 border border-white/5 hover:border-secondary/30 rounded text-xs font-bold text-white uppercase tracking-widest transition-all flex items-center justify-center">
                         Generate Assets <ChevronRight size={14} className="ml-2" />
                      </button>

                   </Card>
                </div>
             ))}
          </div>

       </div>
    </div>
  );
};

export default ExperimentsModule;
