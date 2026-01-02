
import React from 'react';
import { ArrowRight, Check, X, GitCommit } from 'lucide-react';
import Button from './ui/Button';

interface Props {
  original: any;
  variant: any;
  rationale: string;
  changes: string[];
  onAccept: () => void;
  onReject: () => void;
}

const RethinkPreview: React.FC<Props> = ({ original, variant, rationale, changes, onAccept, onReject }) => {
  
  // Helper to render a simplified view of the data for comparison
  const renderPreview = (data: any) => {
    return (
      <div className="text-xs font-mono text-text-muted whitespace-pre-wrap overflow-auto max-h-[400px] opacity-70">
         {JSON.stringify(data, null, 2)}
      </div>
    );
  };

  return (
    <div className="absolute inset-0 z-40 bg-black/90 backdrop-blur-xl flex flex-col animate-fade-in overflow-hidden">
       
       {/* Header */}
       <div className="h-auto md:h-16 mt-20 border-b border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between px-4 md:px-8 py-4 bg-[#0F1113] gap-4">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-primary/10 rounded-lg text-primary animate-pulse">
                <GitCommit size={20} />
             </div>
             <div>
                <h3 className="text-white font-bold">Review Update</h3>
                <p className="text-xs text-text-muted">Compare the proposed changes before merging.</p>
             </div>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
             <Button variant="danger" size="sm" onClick={onReject} className="flex-1 md:flex-none">
                <X size={16} className="mr-2" /> Discard
             </Button>
             <Button variant="primary" size="sm" onClick={onAccept} className="flex-1 md:flex-none">
                <Check size={16} className="mr-2" /> Merge
             </Button>
          </div>
       </div>

       {/* Main Content */}
       <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          
          {/* Left: Rationale & Changelog */}
          <div className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-white/10 p-6 overflow-y-auto bg-black flex-none">
             <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">AI Rationale</h4>
             <div className="p-4 bg-white/5 rounded-xl border border-white/5 mb-8">
                <p className="text-sm text-gray-300 leading-relaxed italic">"{rationale}"</p>
             </div>

             <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Changelog</h4>
             <ul className="space-y-3">
                {changes.map((change, i) => (
                   <li key={i} className="flex items-start text-sm text-text-muted">
                      <span className="text-primary mr-2">•</span> {change}
                   </li>
                ))}
             </ul>
          </div>

          {/* Comparison View */}
          <div className="flex-1 flex flex-col md:flex-row p-4 md:p-6 gap-6 bg-[#050505] overflow-y-auto">
             
             {/* Original */}
             <div className="flex-1 flex flex-col min-h-[300px]">
                <div className="mb-2 text-xs font-mono text-text-muted uppercase text-center">Current Version</div>
                <div className="flex-1 border border-white/10 rounded-xl p-4 bg-[#0A0A0C] overflow-hidden relative grayscale opacity-50">
                   {/* We just render the raw JSON for demo purposes, but in a real app we might render the component itself in a small scale */}
                   {renderPreview(original)}
                </div>
             </div>

             {/* Arrow */}
             <div className="flex items-center justify-center text-white/20 rotate-90 md:rotate-0">
                <ArrowRight size={32} />
             </div>

             {/* New Variant */}
             <div className="flex-1 flex flex-col min-h-[300px]">
                <div className="mb-2 text-xs font-mono text-primary uppercase text-center font-bold">Proposed Update</div>
                <div className="flex-1 border border-primary/30 rounded-xl p-4 bg-primary/5 overflow-hidden relative shadow-[0_0_30px_rgba(46,199,255,0.1)]">
                   {renderPreview(variant)}
                </div>
             </div>

          </div>

       </div>

    </div>
  );
};

export default RethinkPreview;
