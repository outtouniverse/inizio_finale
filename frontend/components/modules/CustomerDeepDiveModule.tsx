
import React from 'react';
import { CustomerPersonaData } from '../../types';
import Card from '../ui/Card';
import { Users, MessageCircle, Brain, Zap, Ban } from 'lucide-react';

interface Props {
  data: CustomerPersonaData;
}

const CustomerDeepDiveModule: React.FC<Props> = ({ data }) => {
  return (
    <div className="h-full overflow-y-auto no-scrollbar p-4 md:p-8">
       <div className="max-w-6xl mx-auto">
          
          <div className="mb-12 text-center">
             <h2 className="text-4xl font-display font-bold text-white mb-4">Psychology <span className="text-secondary">Layer</span></h2>
             <p className="text-xl text-white/80 max-w-2xl mx-auto font-light italic">
                "{data.deepInsight}"
             </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             {data.segments.map((persona, i) => (
                <div key={i} className="group perspective-container">
                   <Card className="h-full bg-[#0F1113] border-white/10 hover:border-secondary/30 transition-all duration-500 cube-hover flex flex-col">
                      
                      <div className="flex items-center space-x-4 mb-6">
                         <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-secondary/50 group-hover:text-secondary transition-colors">
                            <Users size={24} />
                         </div>
                         <div>
                            <h3 className="text-xl font-bold text-white">{persona.name}</h3>
                            <span className="text-xs font-mono text-text-muted uppercase">Primary Archetype</span>
                         </div>
                      </div>

                      <div className="mb-8 relative">
                         <div className="absolute -left-2 top-0 text-4xl text-white/10 font-serif">“</div>
                         <p className="text-lg text-white/90 pl-6 italic leading-relaxed">
                            {persona.quote}
                         </p>
                      </div>

                      <div className="space-y-4 mt-auto">
                         <InsightRow 
                            icon={Brain} 
                            label="Deep Motive" 
                            text={persona.psychology} 
                            color="text-purple-400" 
                         />
                         <InsightRow 
                            icon={Zap} 
                            label="Buying Trigger" 
                            text={persona.trigger} 
                            color="text-yellow-400" 
                         />
                         <InsightRow 
                            icon={Ban} 
                            label="Primary Barrier" 
                            text={persona.barrier} 
                            color="text-red-400" 
                         />
                      </div>

                   </Card>
                </div>
             ))}
          </div>

       </div>
    </div>
  );
};

const InsightRow = ({ icon: Icon, label, text, color }: any) => (
   <div className="flex items-start space-x-4 p-3 rounded-lg bg-white/5 border border-white/5">
      <Icon size={18} className={`${color} mt-0.5 flex-shrink-0`} />
      <div>
         <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${color}`}>{label}</div>
         <div className="text-sm text-gray-300">{text}</div>
      </div>
   </div>
);

export default CustomerDeepDiveModule;
