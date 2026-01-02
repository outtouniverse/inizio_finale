
import React, { useState } from 'react';
import { Project } from '../types';
import { Plus, Box, Activity, Clock, History, PenTool } from 'lucide-react';
import ProjectVersionHistory from './vault/ProjectVersionHistory';
import FounderPlayground from './playground/FounderPlayground';

interface Props {
  onSelect: (id: string) => void;
  onNew: () => void;
  projects: Project[];
}

const IdeaVault: React.FC<Props> = ({ onSelect, onNew, projects }) => {
  const [showHistoryFor, setShowHistoryFor] = useState<Project | null>(null);
  const [showPlayground, setShowPlayground] = useState(false);

  return (
    <>
      {showPlayground && (
         <FounderPlayground onClose={() => setShowPlayground(false)} />
      )}

      {showHistoryFor && (
         <ProjectVersionHistory 
            project={showHistoryFor} 
            onClose={() => setShowHistoryFor(null)} 
            onRestore={(v) => console.log("Restore", v)} // Placeholder logic
         />
      )}

      <div className="h-full mt-20 w-full p-6 md:p-12 overflow-y-auto no-scrollbar">
        <div className="max-w-7xl mx-auto pb-12">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-16 gap-6">
             <div>
               <h1 className="text-4xl md:text-6xl font-display font-bold text-text-main mb-2">Idea Vault</h1>
               <p className="text-text-muted font-mono text-xs md:text-sm tracking-wider">STORED ENTITIES: {projects.length}</p>
             </div>
             
             <div className="flex gap-4 w-full md:w-auto">
               <button 
                 onClick={() => setShowPlayground(true)}
                 className="interactive group flex items-center justify-center space-x-3 px-6 py-3 bg-white/5 text-white border border-white/10 font-bold rounded hover:bg-white/10 transition-all flex-1 md:flex-none"
               >
                 <PenTool size={20} />
                 <span>PLAYGROUND</span>
               </button>
               
               <button 
                 onClick={onNew}
                 className="interactive group flex items-center justify-center space-x-3 px-6 py-3 bg-primary text-background font-bold rounded hover:shadow-[0_0_20px_var(--primary)] transition-all flex-1 md:flex-none"
               >
                 <Plus size={20} />
                 <span>INITIALIZE NEW</span>
               </button>
             </div>
          </div>

          {/* 3D Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12 perspective-container">
             
             {projects.map((project, i) => (
               <div 
                 key={project.id}
                 className="cube-hover relative h-64 md:h-72 w-full cursor-pointer interactive"
                 style={{ transitionDelay: `${i * 50}ms` }}
               >
                  {/* The Cube Face */}
                  <div className="absolute inset-0 glass-panel rounded-xl p-6 md:p-8 flex flex-col justify-between group border-white/10 hover:border-primary/30 transition-colors">
                     
                     <div className="flex justify-between items-start">
                        <div 
                           className="p-3 bg-white/5 rounded border border-white/5 group-hover:bg-primary/10 group-hover:text-primary transition-colors"
                           onClick={() => onSelect(project.id)}
                        >
                          <Box size={24} className="text-text-main" />
                        </div>
                        <div className="flex gap-2">
                           <button 
                              onClick={(e) => { e.stopPropagation(); setShowHistoryFor(project); }}
                              className="p-2 rounded hover:bg-white/10 text-text-muted hover:text-white transition-colors"
                              title="Version History"
                           >
                              <History size={16} />
                           </button>
                           <span className={`text-[10px] font-bold uppercase px-2 py-1.5 rounded border flex items-center ${
                             project.stage === 'Validation' ? 'text-accent border-accent/20 bg-accent/10' : 
                             'text-primary border-primary/20 bg-primary/10'
                           }`}>
                             {project.stage}
                           </span>
                        </div>
                     </div>

                     <div onClick={() => onSelect(project.id)}>
                       <h3 className="text-xl md:text-2xl font-bold text-text-main mb-2 group-hover:text-primary transition-colors">{project.name}</h3>
                       <p className="text-text-muted text-sm line-clamp-2">{project.pitch}</p>
                     </div>

                     <div className="flex items-center justify-between text-xs text-text-dim font-mono pt-4 border-t border-white/5">
                        <div className="flex items-center space-x-2">
                          <Clock size={12} />
                          <span>{project.lastEdited}</span>
                        </div>
                        {project.validationScore > 0 && (
                          <div className="flex items-center space-x-1 text-primary">
                             <Activity size={12} />
                             <span>{project.validationScore}/100</span>
                          </div>
                        )}
                     </div>

                  </div>
               </div>
             ))}

             {/* Empty Slot Placeholder */}
             <div 
               className="h-64 md:h-72 w-full border border-dashed border-white/10 rounded-xl flex items-center justify-center opacity-30 hover:opacity-50 transition-opacity cursor-pointer interactive text-text-muted" 
               onClick={onNew}
             >
                <div className="flex flex-col items-center gap-2">
                  <Plus size={24} />
                  <span className="text-xs font-mono uppercase tracking-widest">Empty Slot</span>
                </div>
             </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default IdeaVault;
