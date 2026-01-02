
import React from 'react';
import { MarketPulseData } from '../../types';
import Card from '../ui/Card';
import { Activity, TrendingUp, BarChart2, Zap, Globe, AlertCircle } from 'lucide-react';

interface Props {
  data: MarketPulseData;
}

const MarketPulseModule: React.FC<Props> = ({ data }) => {
  // Pulse animation rings
  return (
    <div className="h-full flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden relative">
       
       {/* Background Ambient */}
       <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_30%_50%,_var(--tw-gradient-stops))] from-purple-900/20 to-black z-0"></div>

       {/* Left: Radar / Pulse Visual */}
       <div className="flex-1 relative flex items-center justify-center min-h-[300px] lg:min-h-[400px] p-4 md:p-8">
          <div className="relative w-64 h-64 md:w-96 md:h-96 flex items-center justify-center">
             {/* Rings */}
             <div className="absolute inset-0 rounded-full border border-primary/20 animate-pulse"></div>
             <div className="absolute inset-12 rounded-full border border-secondary/20 animate-ping opacity-20"></div>
             <div className="absolute inset-24 rounded-full border border-primary/10 animate-spin-slow"></div>
             
             {/* Center Heat Index */}
             <div className="relative z-10 text-center">
                <div className="text-5xl md:text-6xl font-display font-bold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                   {data.heatIndex}
                </div>
                <div className="text-xs font-mono text-primary uppercase tracking-widest mt-2">Heat Index</div>
             </div>

             {/* Floating Trend Bubbles */}
             {data.trends.map((trend, i) => (
                <div 
                  key={i}
                  className="absolute flex flex-col items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-primary/50 transition-all cursor-pointer group"
                  style={{
                     top: `${50 + 40 * Math.sin((i / data.trends.length) * Math.PI * 2)}%`,
                     left: `${50 + 40 * Math.cos((i / data.trends.length) * Math.PI * 2)}%`,
                     transform: 'translate(-50%, -50%)'
                  }}
                >
                   <div className="text-[9px] md:text-[10px] font-bold text-white text-center px-2 leading-tight">{trend.name}</div>
                   <div className="text-[8px] text-primary mt-1">Force: {trend.force}</div>
                   
                   {/* Tooltip */}
                   <div className="absolute top-full mt-2 w-48 p-3 bg-black border border-white/20 rounded-lg text-xs text-text-muted opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-20 hidden md:block">
                      {trend.description}
                   </div>
                </div>
             ))}
          </div>
       </div>

       {/* Right: Data Panel */}
       <div className="w-full lg:w-[400px] bg-black/50 backdrop-blur-xl border-t lg:border-t-0 lg:border-l border-white/5 p-4 md:p-6 overflow-y-auto">
          <div className="mb-6 md:mb-8">
             <h2 className="text-2xl font-display font-bold text-white flex items-center">
                <Zap className="mr-3 text-primary" /> Market Pulse
             </h2>
             <p className="text-sm text-text-muted">Real-time vibe check based on global signals.</p>
          </div>

          <div className="space-y-6 pb-20 lg:pb-0">
             <Card>
                <div className="flex justify-between items-center mb-2">
                   <span className="text-xs font-mono uppercase text-text-muted">Sentiment</span>
                   <span className={`text-sm font-bold px-2 py-1 rounded border ${
                      data.sentiment === 'Positive' || data.sentiment === 'Hype' ? 'text-green-400 border-green-500/30 bg-green-500/10' : 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10'
                   }`}>
                      {data.sentiment}
                   </span>
                </div>
                <p className="text-sm text-white">Cultural momentum is {data.culturalMomentum.toLowerCase()}.</p>
             </Card>

             <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                   <div className="text-xs text-text-muted uppercase mb-1">Overlap</div>
                   <div className="text-2xl font-bold text-secondary">{data.trendOverlap}%</div>
                </div>
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                   <div className="text-xs text-text-muted uppercase mb-1">Friction</div>
                   <div className="text-xs font-medium text-white line-clamp-2">{data.marketFriction}</div>
                </div>
             </div>

             <div className="pt-6 border-t border-white/10">
                <h3 className="text-sm font-bold text-white mb-4">Trend Forces</h3>
                <div className="space-y-3">
                   {data.trends.map((t, i) => (
                      <div key={i} className="flex items-center justify-between">
                         <span className="text-sm text-text-muted">{t.name}</span>
                         <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${t.force * 10}%` }}></div>
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

export default MarketPulseModule;
