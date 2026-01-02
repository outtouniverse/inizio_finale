
import React, { useState } from 'react';
import { RiskItem } from '../../types';
import { ShieldAlert, AlertTriangle, Zap } from 'lucide-react';
import { ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

interface Props {
  data: RiskItem[];
}

const RiskModule: React.FC<Props> = ({ data }) => {
  const [activeRisk, setActiveRisk] = useState<RiskItem | null>(null);
  
  const safeData = Array.isArray(data) ? data : [];

  // Transform data for Radar Chart
  const chartData = safeData.map(r => ({
    subject: r.risk,
    A: r.impact * 10, // Scale for visuals
    fullMark: 100,
  }));

  return (
    <div className="h-full flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden relative">
       
       {/* Ambient Threat Background */}
       <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/10 to-black z-0"></div>
       <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-noise.png')] opacity-5 pointer-events-none z-0"></div>

       {/* Left: The Shadow Radar */}
       <div className="flex-1 relative flex items-center justify-center min-h-[300px] lg:min-h-[400px]">
          {/* Scanning Effect */}
          <div className="absolute inset-0 rounded-full border border-white/5 animate-pulse-glow"></div>
          <div className="absolute w-[280px] h-[280px] md:w-[600px] md:h-[600px] border border-red-500/10 rounded-full flex items-center justify-center">
             <div className="w-full h-[1px] bg-red-500/20 absolute top-1/2 animate-radar-spin origin-center"></div>
          </div>

          <div className="w-full h-full max-w-lg max-h-lg relative z-10 p-4">
             {safeData.length > 0 ? (
                 <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                      <PolarGrid stroke="#333" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#666', fontSize: 10, fontFamily: 'monospace' }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar
                        name="Risk Impact"
                        dataKey="A"
                        stroke="#EF4444"
                        strokeWidth={2}
                        fill="#EF4444"
                        fillOpacity={0.2}
                      />
                    </RadarChart>
                 </ResponsiveContainer>
             ) : (
                <div className="flex items-center justify-center h-full text-text-muted">No risk data available.</div>
             )}
          </div>
       </div>

       {/* Right: Intelligence Panel */}
       <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-white/5 bg-black/50 backdrop-blur-xl p-6 flex flex-col z-20 overflow-y-auto">
          <div className="mb-8">
             <h3 className="text-2xl font-display font-bold text-white flex items-center mb-2">
                <ShieldAlert className="text-error mr-3" /> Shadow Map
             </h3>
             <p className="text-text-muted text-sm">System detected {safeData.length} critical vectors.</p>
          </div>

          <div className="space-y-4">
             {safeData.map((item, idx) => (
               <div 
                 key={idx} 
                 onClick={() => setActiveRisk(item)}
                 className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 group ${
                    activeRisk === item 
                    ? 'bg-error/10 border-error/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]' 
                    : 'bg-surface border-white/5 hover:border-white/20'
                 }`}
               >
                  <div className="flex justify-between items-start mb-2">
                     <h4 className="font-bold text-white text-sm">{item.risk}</h4>
                     <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${item.impact > 7 ? 'bg-error text-black font-bold' : 'bg-white/10 text-text-muted'}`}>
                        LVL {item.impact}
                     </span>
                  </div>
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-2">
                     <div className="h-full bg-error transition-all duration-1000" style={{ width: `${item.probability * 10}%` }}></div>
                  </div>
                  {activeRisk === item && (
                     <div className="mt-3 pt-3 border-t border-white/10 animate-fade-in">
                        <p className="text-xs text-text-muted mb-2"><strong className="text-white">Mitigation:</strong> {item.mitigation}</p>
                        <button className="w-full py-2 bg-error/20 hover:bg-error/30 text-error text-xs font-bold uppercase rounded transition-colors flex items-center justify-center">
                           <Zap size={12} className="mr-2" /> Initiate Protocol
                        </button>
                     </div>
                  )}
               </div>
             ))}
          </div>

          {/* Crisis Mode Overlay (Visual Only) */}
          {activeRisk && activeRisk.impact > 8 && (
             <div className="mt-auto pt-6 pb-20 lg:pb-0">
                <div className="p-4 bg-red-950/30 border border-red-500/30 rounded-lg flex items-start space-x-3 animate-pulse">
                   <AlertTriangle className="text-red-500 flex-shrink-0" />
                   <div>
                      <h5 className="text-red-500 font-bold text-sm uppercase mb-1">Critical Vector</h5>
                      <p className="text-xs text-red-200/70">High dependency detected. Recommend immediate contingency planning.</p>
                   </div>
                </div>
             </div>
          )}
       </div>

    </div>
  );
};

export default RiskModule;
