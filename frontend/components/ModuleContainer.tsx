
import React, { useState } from 'react';
import { AgentStep, ArtifactVersion } from '../types';
import { MessageSquare, History, RotateCcw, GitCommit, ChevronDown } from 'lucide-react';
import Button from './ui/Button';

interface Props {
  step: AgentStep;
  children: React.ReactNode;
  versions: ArtifactVersion[];
  onFeedback: () => void;
  onRestore: (version: ArtifactVersion) => void;
}

const ModuleContainer: React.FC<Props> = ({ step, children, versions, onFeedback, onRestore }) => {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="relative h-full flex flex-col">
      
      {/* Co-founder Control Bar */}
      <div className="absolute top-0 left-0 right-0 h-16 z-50 flex items-center justify-between px-6 md:px-8 pointer-events-none">
        {/* Left: Context (Handled by parent nav mostly, but we can add status) */}
        <div className="pointer-events-auto">
           {/* Space reserved */}
        </div>

        {/* Right: Actions */}
        <div className="pointer-events-auto flex items-center space-x-2 bg-black/50 backdrop-blur-md p-1.5 rounded-full border border-white/10">
           
           <Button 
             variant="ghost" 
             size="sm" 
             className="rounded-full px-4 hover:bg-white/10"
             onClick={onFeedback}
           >
             <MessageSquare size={14} className="mr-2 text-primary" />
             <span className="hidden md:inline">Feedback</span>
           </Button>

           <div className="w-[1px] h-4 bg-white/10"></div>

           <div className="relative">
             <Button 
               variant="ghost" 
               size="sm" 
               className={`rounded-full px-3 ${showHistory ? 'bg-white/10 text-white' : ''}`}
               onClick={() => setShowHistory(!showHistory)}
             >
                <History size={14} className="mr-1" />
                <span className="text-[10px] font-mono opacity-70">v{versions.length}.0</span>
                <ChevronDown size={12} className="ml-1 opacity-50" />
             </Button>

             {/* Dropdown History */}
             {showHistory && (
               <div className="absolute top-full right-0 mt-2 w-64 bg-[#121214] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-fade-in z-[60]">
                  <div className="p-3 border-b border-white/5 text-xs font-mono text-text-muted uppercase tracking-wider">
                     Version History
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                     {versions.slice().reverse().map((v, i) => (
                       <button 
                         key={v.id}
                         onClick={() => { onRestore(v); setShowHistory(false); }}
                         className="w-full text-left p-3 hover:bg-white/5 flex items-start gap-3 transition-colors group"
                       >
                          <div className="mt-1">
                             {i === 0 ? (
                               <div className="w-2 h-2 bg-primary rounded-full shadow-[0_0_5px_#2EC7FF]"></div>
                             ) : (
                               <div className="w-2 h-2 bg-white/20 rounded-full group-hover:bg-white/50"></div>
                             )}
                          </div>
                          <div>
                             <div className="text-sm text-white font-medium flex items-center">
                                v{versions.length - i}.0
                                {i === 0 && <span className="ml-2 text-[9px] bg-primary/10 text-primary px-1 rounded">LATEST</span>}
                             </div>
                             <div className="text-xs text-text-muted mt-0.5 line-clamp-1">
                               {v.feedback ? `Refined: "${v.feedback.text}"` : 'Initial Generation'}
                             </div>
                             <div className="text-[10px] text-text-dim mt-1 font-mono">
                               {new Date(v.timestamp).toLocaleTimeString()}
                             </div>
                          </div>
                       </button>
                     ))}
                  </div>
               </div>
             )}
           </div>

        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 h-full pt-0">
         {children}
      </div>

    </div>
  );
};

export default ModuleContainer;
