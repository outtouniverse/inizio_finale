
import React, { useRef } from 'react';
import { TimelineEvent } from '../../types';
import { MOCK_FOUNDER_TIMELINE_EVENTS } from '../../constants';
import { Zap, Flag, Lightbulb, AlertTriangle } from 'lucide-react';

const FounderTimeline: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const getIcon = (type: string) => {
    switch (type) {
      case 'IDEA': return <Lightbulb size={16} className="text-yellow-400" />;
      case 'EXECUTION': return <Zap size={16} className="text-blue-400" />;
      case 'MILESTONE': return <Flag size={16} className="text-green-400" />;
      case 'PIVOT': return <AlertTriangle size={16} className="text-orange-400" />;
      default: return <Flag size={16} className="text-white" />;
    }
  };

  return (
    <div className="w-full mt-20 h-[220px] bg-white/5 rounded-3xl border border-white/10 relative overflow-hidden flex flex-col backdrop-blur-sm">
       <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50 pointer-events-none z-10"></div>
       
       <div className="px-6 py-4 flex-none border-b border-white/5 flex justify-between items-center z-20 bg-black/20">
          <div>
            <h3 className="text-white font-bold text-lg">Journey Timeline</h3>
            <p className="text-xs text-text-muted">Key moments in your evolution.</p>
          </div>
       </div>

       <div 
         ref={scrollRef}
         className="flex-1 overflow-x-auto overflow-y-hidden flex items-center px-10 gap-12 no-scrollbar relative z-0"
       >
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-white/10 -translate-y-1/2 z-0"></div>

          {MOCK_FOUNDER_TIMELINE_EVENTS.map((event, i) => (
             <div key={event.id} className="relative z-10 flex flex-col items-center group min-w-[140px] cursor-pointer">
                {/* Date Bubble */}
                <div className="mb-4 opacity-50 group-hover:opacity-100 transition-opacity text-[10px] font-mono text-text-muted bg-black/50 px-2 py-1 rounded-full border border-white/10">
                   {event.date}
                </div>
                
                {/* Node */}
                <div className="w-10 h-10 rounded-full bg-[#121214] border-2 border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:border-primary transition-all shadow-xl z-10 relative">
                   {getIcon(event.type)}
                   <div className="absolute inset-0 bg-primary/20 rounded-full opacity-0 group-hover:opacity-100 animate-ping"></div>
                </div>

                {/* Content */}
                <div className="mt-4 text-center">
                   <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors">{event.title}</h4>
                   <p className="text-[10px] text-text-muted max-w-[120px] leading-tight mt-1 opacity-70 group-hover:opacity-100 transition-opacity">{event.description}</p>
                </div>
             </div>
          ))}

          {/* End Cap */}
          <div className="min-w-[50px]"></div>
       </div>
    </div>
  );
};

export default FounderTimeline;
