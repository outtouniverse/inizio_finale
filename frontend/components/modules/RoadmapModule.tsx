
import React from 'react';
import { RoadmapItem } from '../../types';
import Card from '../ui/Card';
import { Calendar, CheckCircle2, Flag } from 'lucide-react';

interface Props {
  data: RoadmapItem[];
}

const RoadmapModule: React.FC<Props> = ({ data }) => {
  return (
    <div className="h-full overflow-y-auto no-scrollbar p-4 md:p-8">
       <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-display font-bold text-white mb-8">Execution <span className="text-primary">Plan</span></h2>

          <div className="relative space-y-8">
             {/* Vertical Line */}
             <div className="absolute left-4 top-4 bottom-4 w-[1px] bg-gradient-to-b from-primary to-transparent opacity-30"></div>

             {data.map((phase, i) => (
                <div key={i} className="relative pl-12 animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                   {/* Node */}
                   <div className="absolute left-0 top-0 w-8 h-8 bg-black border border-primary rounded-full flex items-center justify-center z-10">
                      <span className="text-xs font-bold text-primary">{i + 1}</span>
                   </div>

                   <Card className="bg-white/5 hover:bg-white/[0.07] transition-colors border-white/10">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 border-b border-white/5 pb-4">
                         <div>
                            <h3 className="text-lg font-bold text-white">{phase.phase}</h3>
                            <span className="text-xs font-mono text-text-muted flex items-center mt-1">
                               <Calendar size={12} className="mr-2" /> {phase.timing}
                            </span>
                         </div>
                         <div className="mt-2 md:mt-0 px-3 py-1 rounded bg-primary/10 border border-primary/20 text-primary text-xs font-bold flex items-center">
                            <Flag size={12} className="mr-2" /> {phase.milestone}
                         </div>
                      </div>

                      <div className="space-y-2">
                         {phase.tasks.map((task, t) => (
                            <div key={t} className="flex items-center space-x-3 text-sm text-gray-300">
                               <CheckCircle2 size={14} className="text-white/20" />
                               <span>{task}</span>
                            </div>
                         ))}
                      </div>
                   </Card>
                </div>
             ))}
          </div>
       </div>
    </div>
  );
};

export default RoadmapModule;
