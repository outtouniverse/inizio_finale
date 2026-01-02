
import React from 'react';
import { ScoreData } from '../../types';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import Card from '../ui/Card';

interface Props {
  data: ScoreData;
}

const ScoreModule: React.FC<Props> = ({ data }) => {
  const chartData = [
    { name: 'Market', value: data.breakdown.market, color: '#2EC7FF' },
    { name: 'Feasibility', value: data.breakdown.feasibility, color: '#AA66FF' },
    { name: 'Tech', value: data.breakdown.tech, color: '#FFD60A' },
    { name: 'Moat', value: data.breakdown.moat, color: '#FFFFFF' },
  ];

  return (
    <div className="h-full flex flex-col items-center justify-center relative p-4">
       
       {/* Background Flare */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

       <div className="relative z-10 flex flex-col items-center w-full">
         
         {/* The Score Ring */}
         <div className="relative w-64 h-64 md:w-80 md:h-80 mb-8 md:mb-12">
           {/* Center Text */}
           <div className="absolute inset-0 flex items-center justify-center flex-col z-20">
             <span className="text-6xl md:text-8xl font-display font-bold text-white neon-glow-text tracking-tighter">
               {data.total}
             </span>
             <span className="text-[10px] md:text-xs font-mono text-primary uppercase tracking-[0.3em] mt-4 border border-primary/30 px-3 py-1 rounded-full bg-primary/10">
               Inizio Score
             </span>
           </div>
           
           {/* Chart Ring */}
           <div className="absolute inset-0 opacity-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    innerRadius={window.innerWidth < 768 ? 80 : 100}
                    outerRadius={window.innerWidth < 768 ? 90 : 110}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} style={{ filter: `drop-shadow(0 0 8px ${entry.color})` }} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
           </div>

           {/* Decorative Spinning Rings */}
           <div className="absolute inset-[-10px] md:inset-[-20px] border border-white/5 rounded-full animate-orbit-slow border-dashed opacity-30"></div>
           <div className="absolute inset-[-20px] md:inset-[-40px] border border-white/5 rounded-full animate-orbit-medium opacity-20"></div>
         </div>

         {/* Verdict Card */}
         <div className="max-w-2xl w-full text-center space-y-8 animate-slide-up pb-20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {chartData.map((item) => (
                <div key={item.name} className="text-center">
                  <div className="text-[10px] font-mono text-text-muted uppercase mb-2">{item.name}</div>
                  <div className="text-lg md:text-xl font-bold" style={{ color: item.color }}>{item.value}</div>
                </div>
              ))}
            </div>

            <Card className="bg-white/5 border-white/10 backdrop-blur-md">
               <p className="text-base md:text-lg text-white font-light italic">"{data.verdict}"</p>
            </Card>
         </div>

       </div>
    </div>
  );
};

export default ScoreModule;
