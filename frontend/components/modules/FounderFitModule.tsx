
import React from 'react';
import { FounderFitData } from '../../types';
import Card from '../ui/Card';
import { UserCheck, UserX, Brain, Briefcase, Hammer, ArrowRight } from 'lucide-react';

interface Props {
  data: FounderFitData;
}

const FounderFitModule: React.FC<Props> = ({ data }) => {
  const isHighFit = data.verdict.includes("High") || data.verdict.includes("Strong");

  return (
    <div className="h-full overflow-y-auto no-scrollbar p-4 md:p-8">
       <div className="max-w-5xl mx-auto">
          
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
             <div>
                <h2 className="text-4xl font-display font-bold text-white mb-2">Founder <span className="text-primary">Fit</span></h2>
                <p className="text-text-muted text-lg">Why are you the one to build this?</p>
             </div>
             <div className={`px-4 py-2 rounded-lg border ${isHighFit ? 'border-green-500/30 bg-green-500/10 text-green-400' : 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400'}`}>
                <span className="text-xs font-mono uppercase tracking-widest font-bold">{data.verdict}</span>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
             
             {/* The Mirror (Why You) */}
             <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
                <div className="flex items-center space-x-3 mb-6">
                   <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <UserCheck size={20} />
                   </div>
                   <h3 className="font-bold text-white">The Unfair Advantage</h3>
                </div>
                <p className="text-xl text-white font-light leading-relaxed italic">
                   "{data.whyYou}"
                </p>
             </Card>

             {/* Blind Spots */}
             <Card className="bg-red-900/5 border-red-500/10">
                <div className="flex items-center space-x-3 mb-6">
                   <div className="p-2 bg-red-500/10 rounded-lg text-red-400">
                      <UserX size={20} />
                   </div>
                   <h3 className="font-bold text-white">Personal Blindspots</h3>
                </div>
                <ul className="space-y-3">
                   {data.blindSpots.map((blind, i) => (
                      <li key={i} className="flex items-start text-gray-300">
                         <span className="text-red-500 mr-2 mt-1">•</span>
                         {blind}
                      </li>
                   ))}
                </ul>
             </Card>
          </div>

          {/* Skill Bridge */}
          <div>
             <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <Hammer className="mr-2 text-secondary" size={20} /> Skill Bridge
             </h3>
             
             <div className="space-y-4">
                {data.skillBridge.map((skill, i) => (
                   <div key={i} className="p-4 md:p-6 bg-surface border border-white/5 rounded-xl flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 group hover:border-white/10 transition-colors">
                      
                      {/* Skill Name & Status */}
                      <div className="flex-1 min-w-[200px]">
                         <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-white text-lg">{skill.required}</span>
                            <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${
                               skill.status === 'Have' ? 'bg-green-500/20 text-green-400' :
                               skill.status === 'Gap' ? 'bg-red-500/20 text-red-400' :
                               'bg-blue-500/20 text-blue-400'
                            }`}>
                               {skill.status}
                            </span>
                         </div>
                         <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className={`h-full ${
                               skill.status === 'Have' ? 'bg-green-500 w-full' :
                               skill.status === 'Gap' ? 'bg-red-500 w-[10%]' :
                               'bg-blue-500 w-[50%]'
                            }`}></div>
                         </div>
                      </div>

                      {/* Strategy Arrow */}
                      <div className="hidden md:block text-white/20">
                         <ArrowRight size={20} />
                      </div>

                      {/* Strategy Text */}
                      <div className="flex-1">
                         <span className="text-xs font-mono text-text-muted uppercase block mb-1">Bridging Strategy</span>
                         <p className="text-sm text-gray-300">{skill.strategy}</p>
                      </div>

                   </div>
                ))}
             </div>
          </div>

       </div>
    </div>
  );
};

export default FounderFitModule;
