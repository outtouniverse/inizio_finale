import React from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { MOCK_MVP_FEATURES, STACKS } from '../constants';
import { Download, Presentation, Code, CreditCard } from 'lucide-react';

const BuildKit: React.FC = () => {
  return (
    <div className="space-y-8 animate-slide-up">
      
      {/* Header */}
      <div className="flex items-center justify-between">
         <div>
           <h2 className="text-2xl font-display font-bold text-white">Build Kit</h2>
           <p className="text-text-muted">Generated blueprint based on validation data.</p>
         </div>
         <Button variant="primary" className="group">
           <Presentation size={18} className="mr-2" />
           Generate Pitch Deck
         </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Column 1: MVP Scope */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-medium text-white">MVP Feature Scope (RICE Prioritized)</h3>
              <span className="text-xs text-text-muted">Est. Dev Time: 3 Weeks</span>
            </div>
            
            <div className="space-y-2">
              {MOCK_MVP_FEATURES.map(feature => (
                <div key={feature.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      feature.priority === 'High' ? 'bg-error' : 
                      feature.priority === 'Medium' ? 'bg-warning' : 'bg-blue-500'
                    }`} />
                    <span className="text-text-main text-sm">{feature.name}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-xs font-mono text-text-muted bg-white/5 px-2 py-1 rounded">{feature.effort} Effort</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      feature.status === 'Done' ? 'text-success bg-success/10' : 
                      feature.status === 'In Progress' ? 'text-primary bg-primary/10' : 'text-text-muted bg-white/5'
                    }`}>
                      {feature.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
             <h3 className="font-medium text-white mb-4">Financial Sketch</h3>
             <div className="grid grid-cols-3 gap-4 text-center">
               <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                 <p className="text-xs text-text-muted mb-1">Break-even</p>
                 <p className="text-xl font-mono text-white">Month 4</p>
               </div>
               <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                 <p className="text-xs text-text-muted mb-1">Burn Rate</p>
                 <p className="text-xl font-mono text-white">$1.2k<span className="text-xs text-text-muted">/mo</span></p>
               </div>
               <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                 <p className="text-xs text-text-muted mb-1">Pricing</p>
                 <p className="text-xl font-mono text-white">$19<span className="text-xs text-text-muted">/mo</span></p>
               </div>
             </div>
          </Card>
        </div>

        {/* Column 2: Tech & Exports */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-b from-surface to-[#0F1113]">
            <h3 className="font-medium text-white mb-4">Suggested Tech Stack</h3>
            <div className="space-y-3">
              {STACKS.map((stack, idx) => (
                <div key={idx} className="p-3 rounded-lg border border-white/10 bg-white/5 cursor-pointer hover:border-primary/50 hover:bg-white/10 transition-all">
                  <div className="flex justify-between mb-1">
                    <span className="font-bold text-sm text-white">{stack.name}</span>
                    {idx === 0 && <span className="text-[10px] bg-primary text-[#0F1113] px-1.5 rounded font-bold">REC</span>}
                  </div>
                  <p className="text-xs font-mono text-primary mb-1">{stack.tech}</p>
                  <p className="text-xs text-text-muted">{stack.desc}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
             <h3 className="font-medium text-white mb-4">Deliverables</h3>
             <div className="space-y-2">
               <Button variant="secondary" className="w-full justify-between group">
                 <span className="flex items-center"><Code size={16} className="mr-2 text-text-muted" /> Landing Page Code</span>
                 <Download size={14} className="opacity-0 group-hover:opacity-100" />
               </Button>
               <Button variant="secondary" className="w-full justify-between group">
                 <span className="flex items-center"><CreditCard size={16} className="mr-2 text-text-muted" /> Stripe Connect</span>
                 <span className="text-[10px] uppercase bg-white/10 px-1 rounded">Setup</span>
               </Button>
             </div>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default BuildKit;