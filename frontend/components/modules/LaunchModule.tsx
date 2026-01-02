
import React from 'react';
import { LaunchData } from '../../types';
import Card from '../ui/Card';
import { Rocket, Megaphone, Share2, CalendarDays, Layout } from 'lucide-react';

interface Props {
  data: LaunchData;
}

const LaunchModule: React.FC<Props> = ({ data }) => {
  return (
    <div className="h-full overflow-y-auto no-scrollbar p-4 md:p-8">
       <div className="max-w-6xl mx-auto">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 border-b border-white/10 pb-6 gap-4">
             <div>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">Launch <span className="text-accent">Control</span></h2>
                <p className="text-text-muted">Go-to-Market Strategy & Execution Plan.</p>
             </div>
             <div className="w-full md:w-auto bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                <span className="text-xs font-mono text-text-muted uppercase mr-2 block md:inline mb-1 md:mb-0">Headline:</span>
                <span className="text-sm font-bold text-white italic">"{data.headline}"</span>
             </div>
          </div>

          {/* Kanban / Storyboard Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[600px] pb-20">
             
             {/* Col 1: Channels */}
             <div className="flex flex-col gap-4 h-full">
                <div className="flex items-center space-x-2 text-sm font-bold text-white uppercase tracking-wider pb-2 border-b border-white/10">
                   <Megaphone size={16} /> <span>Channels</span>
                </div>
                <div className="space-y-4 lg:overflow-y-auto pr-2">
                   {data.channels.map((c, i) => (
                      <Card key={i} className="hover:border-accent/50 transition-colors cursor-grab active:cursor-grabbing group">
                         <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-white">{c.name}</h4>
                            <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${c.type === 'Paid' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>{c.type}</span>
                         </div>
                         <p className="text-xs text-text-muted leading-relaxed">{c.strategy}</p>
                      </Card>
                   ))}
                   <button className="w-full py-3 border border-dashed border-white/10 rounded-lg text-text-muted hover:text-white hover:border-white/30 transition-all text-xs uppercase font-bold">
                      + Add Channel
                   </button>
                </div>
             </div>

             {/* Col 2: Content */}
             <div className="flex flex-col gap-4 h-full">
                <div className="flex items-center space-x-2 text-sm font-bold text-white uppercase tracking-wider pb-2 border-b border-white/10">
                   <Layout size={16} /> <span>Content Pillars</span>
                </div>
                <div className="space-y-4 lg:overflow-y-auto pr-2">
                   {data.contentPillars.map((p, i) => (
                      <div key={i} className="p-4 bg-yellow-100/5 border border-yellow-100/10 hover:bg-yellow-100/10 transition-colors rounded-none rotate-1 hover:rotate-0 duration-300 shadow-lg">
                         <div className="w-8 h-2 bg-yellow-500/20 mb-2"></div>
                         <p className="text-lg font-display font-bold text-yellow-50">{p}</p>
                      </div>
                   ))}
                </div>
             </div>

             {/* Col 3: Timeline */}
             <div className="flex flex-col gap-4 h-full">
                <div className="flex items-center space-x-2 text-sm font-bold text-white uppercase tracking-wider pb-2 border-b border-white/10">
                   <CalendarDays size={16} /> <span>Sequence</span>
                </div>
                <div className="relative space-y-0">
                   <div className="absolute left-3 top-0 bottom-0 w-[1px] bg-white/10"></div>
                   {data.timeline.map((t, i) => (
                      <div key={i} className="relative pl-8 py-3">
                         <div className="absolute left-[9px] top-5 w-1.5 h-1.5 bg-accent rounded-full ring-4 ring-black"></div>
                         <div className="p-3 bg-white/5 border border-white/5 rounded-lg hover:border-accent/30 transition-colors">
                            <span className="text-sm text-gray-300">{t}</span>
                         </div>
                      </div>
                   ))}
                </div>
             </div>

          </div>

       </div>
    </div>
  );
};

export default LaunchModule;
