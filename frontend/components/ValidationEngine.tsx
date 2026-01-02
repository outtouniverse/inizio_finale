
import React from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { MOCK_EXPERIMENTS } from '../constants';
import { Play, CheckCircle, BarChart2, ArrowRight } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const data = [
  { name: 'Day 1', visitors: 40, conversions: 2 },
  { name: 'Day 2', visitors: 120, conversions: 8 },
  { name: 'Day 3', visitors: 300, conversions: 45 },
  { name: 'Day 4', visitors: 280, conversions: 39 },
  { name: 'Day 5', visitors: 500, conversions: 60 },
];

const ValidationEngine: React.FC = () => {
  return (
    <div className="space-y-8 animate-slide-up">
      
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20 flex flex-col justify-center items-center py-8">
           <span className="text-4xl font-mono font-bold text-primary neon-text">72</span>
           <span className="text-xs uppercase tracking-widest text-text-muted mt-2">Validation Score</span>
        </Card>
        <Card className="flex flex-col justify-center p-6">
           <span className="text-2xl font-mono font-bold text-white">1,240</span>
           <span className="text-xs text-text-muted">Total Visitors</span>
        </Card>
        <Card className="flex flex-col justify-center p-6">
           <span className="text-2xl font-mono font-bold text-white">12.4%</span>
           <span className="text-xs text-text-muted">Avg. Conversion</span>
        </Card>
        <Card className="flex flex-col justify-center p-6">
           <span className="text-2xl font-mono font-bold text-white">3</span>
           <span className="text-xs text-text-muted">Experiments Run</span>
        </Card>
      </div>

      {/* Main Content: Active & History */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left: Experiment List */}
        <div className="w-full lg:w-1/3 space-y-4">
          <div className="flex items-center justify-between mb-2">
             <h3 className="text-lg font-medium text-white">Experiments</h3>
             <Button size="sm" variant="ghost" className="text-primary">+ New</Button>
          </div>

          {MOCK_EXPERIMENTS.experiments.map(exp => (
             <Card 
               key={exp.name} 
               hoverEffect 
               className="border-l-4 border-l-primary"
             >
               <div className="flex justify-between items-start mb-2">
                 <span className="text-xs font-mono text-text-muted uppercase">{exp.type}</span>
                 <span className="flex h-2 w-2 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span></span>
               </div>
               <h4 className="font-medium text-white mb-1">{exp.name}</h4>
               <div className="flex items-center text-sm text-text-muted space-x-4">
                 <span>{exp.duration}</span>
                 <span>{exp.impact}/10 Impact</span>
               </div>
             </Card>
          ))}
        </div>

        {/* Right: Active Experiment Detail */}
        <div className="flex-1">
          <Card className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
               <div>
                 <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-xl font-bold text-white">Waitlist "Fake Door"</h3>
                    <span className="px-2 py-0.5 rounded-full bg-success/20 text-success text-xs">Completed</span>
                 </div>
                 <p className="text-sm text-text-muted">A/B Test landing page focusing on "Automated Negotiation" value prop.</p>
               </div>
               <div className="flex space-x-2">
                 <Button variant="secondary" size="sm">View Page</Button>
                 <Button variant="primary" size="sm">Export Report</Button>
               </div>
            </div>

            {/* Chart */}
            <div className="h-64 w-full mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorConv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00D1C1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00D1C1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#181B1F', border: '1px solid rgba(255,255,255,0.1)' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="conversions" stroke="#00D1C1" strokeWidth={2} fillOpacity={1} fill="url(#colorConv)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Insights */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10 mt-auto">
              <div className="flex items-start space-x-3">
                 <div className="bg-primary/20 p-2 rounded-full text-primary">
                   <CheckCircle size={18} />
                 </div>
                 <div>
                   <h5 className="text-white font-medium mb-1">Key Insight: High Intent</h5>
                   <p className="text-sm text-text-muted mb-3">
                     This experiment validated the problem. Users clicked "Pricing" 4x more than "Features", indicating readiness to pay.
                   </p>
                   <Button variant="ghost" className="text-primary p-0 hover:bg-transparent hover:underline justify-start h-auto">
                     Create MVP Scope based on this <ArrowRight size={14} className="ml-1" />
                   </Button>
                 </div>
              </div>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default ValidationEngine;
