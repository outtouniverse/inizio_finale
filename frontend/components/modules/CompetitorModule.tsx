
import React from 'react';
import { CompetitorData } from '../../types';
import Card from '../ui/Card';
import { Target, ShieldAlert, Swords, TrendingUp } from 'lucide-react';

interface Props {
  data: CompetitorData;
}

const CompetitorModule: React.FC<Props> = ({ data }) => {
  return (
    <div className="h-full overflow-y-auto no-scrollbar p-4 md:p-8">
       <div className="max-w-5xl mx-auto pb-20">
          
          <div className="mb-10">
             <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">Competitive <span className="text-primary">Intel</span></h2>
             <p className="text-lg md:text-xl text-text-muted font-light">{data.landscape}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
             {/* Opportunity Card */}
             <div className="lg:col-span-3">
                <Card className="bg-gradient-to-r from-primary/10 to-transparent border-primary/20">
                   <div className="flex items-start space-x-4">
                      <div className="p-3 bg-primary/20 rounded-lg text-primary">
                         <TrendingUp size={24} />
                      </div>
                      <div>
                         <h3 className="text-lg font-bold text-white mb-1">Your Winning Gap</h3>
                         <p className="text-white/80 leading-relaxed text-sm md:text-base">{data.opportunityGap}</p>
                      </div>
                   </div>
                </Card>
             </div>

             {/* Competitor Cards */}
             {data.competitors.map((comp, i) => (
                <Card key={i} className="hover:border-white/20 transition-colors">
                   <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-bold text-white">{comp.name}</h3>
                      <span className={`text-[10px] uppercase px-2 py-1 rounded border ${
                         comp.type === 'Direct' ? 'border-red-500/30 text-red-400 bg-red-500/5' : 'border-blue-500/30 text-blue-400 bg-blue-500/5'
                      }`}>
                         {comp.type}
                      </span>
                   </div>
                   
                   <div className="space-y-3">
                      <div className="p-2 bg-white/5 rounded border border-white/5">
                         <div className="flex items-center space-x-2 text-xs text-text-muted mb-1 uppercase tracking-wider">
                            <ShieldAlert size={12} /> <span>Strength</span>
                         </div>
                         <p className="text-sm text-white">{comp.strength}</p>
                      </div>
                      <div className="p-2 bg-white/5 rounded border border-white/5">
                         <div className="flex items-center space-x-2 text-xs text-text-muted mb-1 uppercase tracking-wider">
                            <Swords size={12} /> <span>Weakness</span>
                         </div>
                         <p className="text-sm text-white">{comp.weakness}</p>
                      </div>
                   </div>
                </Card>
             ))}
          </div>

       </div>
    </div>
  );
};

export default CompetitorModule;
