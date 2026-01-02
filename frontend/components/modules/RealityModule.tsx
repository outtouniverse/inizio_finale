
import React from 'react';
import { RealityData } from '../../types';
import Card from '../ui/Card';
import { AlertTriangle, Skull, TrendingDown, HeartPulse } from 'lucide-react';

interface Props {
  data: RealityData;
}

const RealityModule: React.FC<Props> = ({ data }) => {
  return (
    <div className="h-full flex items-center justify-center p-4">
       <div className="max-w-2xl w-full space-y-6">
          
          <div className="text-center mb-8">
             <div className="inline-block p-4 bg-red-500/10 rounded-full border border-red-500/20 mb-4">
                <Skull size={32} className="text-red-500" />
             </div>
             <h2 className="text-3xl font-display font-bold text-white">Reality <span className="text-red-500">Check</span></h2>
             <p className="text-text-muted">The AI ignores your feelings to save your time.</p>
          </div>

          <Card className="border-l-4 border-l-red-500 bg-red-950/10">
             <h3 className="text-sm font-mono text-red-400 uppercase tracking-widest mb-2">The Brutal Truth</h3>
             <p className="text-xl md:text-2xl text-white font-light leading-relaxed">"{data.brutalTruth}"</p>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <Card>
                <div className="flex items-center space-x-2 mb-2 text-orange-400">
                   <AlertTriangle size={18} />
                   <span className="text-xs font-mono uppercase">The Bottleneck</span>
                </div>
                <p className="text-white font-medium">{data.hardestChallenge}</p>
             </Card>
             
             <Card>
                <div className="flex items-center space-x-2 mb-2 text-blue-400">
                   <TrendingDown size={18} />
                   <span className="text-xs font-mono uppercase">Cash Outlook</span>
                </div>
                <p className="text-white font-medium">{data.financialOutlook}</p>
             </Card>
          </div>

          <div className="p-4 rounded-xl bg-black border border-white/10 flex items-center justify-between">
             <div className="flex items-center space-x-3">
                <HeartPulse size={20} className={data.survivalProbability > 50 ? 'text-green-500' : 'text-red-500'} />
                <span className="text-sm text-text-muted">Estimated Survival Probability (Year 1)</span>
             </div>
             <span className={`font-mono text-xl font-bold ${data.survivalProbability > 50 ? 'text-green-500' : 'text-red-500'}`}>
                {data.survivalProbability}%
             </span>
          </div>

       </div>
    </div>
  );
};

export default RealityModule;
