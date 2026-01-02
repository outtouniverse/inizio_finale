
import React from 'react';
import { MOCK_EXECUTION_HEATMAP_DATA } from '../../constants';

const ExecutionHeatmap: React.FC = () => {
  // We'll display the last 5 months approx (20 weeks) for compactness
  const displayData = MOCK_EXECUTION_HEATMAP_DATA.slice(-140); 

  const getColor = (intensity: number) => {
    switch(intensity) {
      case 0: return 'bg-white/5';
      case 1: return 'bg-primary/20';
      case 2: return 'bg-primary/40';
      case 3: return 'bg-primary/60';
      case 4: return 'bg-primary';
      default: return 'bg-white/5';
    }
  };

  return (
    <div className="w-full bg-black/40 rounded-3xl border border-white/10 p-6 backdrop-blur-sm">
       <div className="flex justify-between items-center mb-6">
          <div>
             <h3 className="text-white font-bold text-lg">Execution Rhythm</h3>
             <p className="text-xs text-text-muted">Consistency creates momentum.</p>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-text-muted">
             <span>Less</span>
             <div className="flex gap-1">
                <div className="w-2 h-2 bg-white/5 rounded-sm"></div>
                <div className="w-2 h-2 bg-primary/20 rounded-sm"></div>
                <div className="w-2 h-2 bg-primary/60 rounded-sm"></div>
                <div className="w-2 h-2 bg-primary rounded-sm"></div>
             </div>
             <span>More</span>
          </div>
       </div>

       <div className="flex flex-wrap gap-1 justify-center md:justify-start">
          {displayData.map((day, i) => (
             <div 
               key={i}
               title={`${day.date}: ${day.count} actions`}
               className={`w-3 h-3 md:w-4 md:h-4 rounded-sm ${getColor(day.intensity)} hover:ring-1 hover:ring-white transition-all cursor-help`}
             ></div>
          ))}
       </div>
       
       <div className="mt-6 flex gap-8">
          <div>
             <span className="block text-2xl font-bold text-white">12</span>
             <span className="text-[10px] text-text-muted uppercase tracking-wider">Day Streak</span>
          </div>
          <div>
             <span className="block text-2xl font-bold text-white">1,420</span>
             <span className="text-[10px] text-text-muted uppercase tracking-wider">Total Actions</span>
          </div>
          <div>
             <span className="block text-2xl font-bold text-primary">Top 5%</span>
             <span className="text-[10px] text-text-muted uppercase tracking-wider">Ranking</span>
          </div>
       </div>
    </div>
  );
};

export default ExecutionHeatmap;
