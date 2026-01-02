
import React, { useState } from 'react';
import { Project, ArtifactVersion } from '../../types';
import Card from '../ui/Card';
import { History, GitCommit, ArrowLeft, RotateCcw, ChevronRight } from 'lucide-react';
import Button from '../ui/Button';

interface Props {
  project: Project;
  onClose: () => void;
  onRestore: (version: ArtifactVersion) => void;
}

// Mock versions for UI if real ones aren't populated deeply
const MOCK_VERSIONS: ArtifactVersion[] = [
    {
        id: 'v1',
        timestamp: Date.now() - 10000000,
        step: 'VALIDATION',
        data: { verdict: 'Uncertain' },
        rationale: 'Initial generation.',
        changes: ['Created validation report']
    },
    {
        id: 'v2',
        timestamp: Date.now() - 5000000,
        step: 'VALIDATION',
        data: { verdict: 'Go for it' },
        feedback: { id: 'f1', type: 'ACCURACY', text: 'Be more optimistic', timestamp: Date.now() },
        rationale: 'Adjusted tone based on founder feedback.',
        changes: ['Updated verdict to positive', 'Removed aggressive risk warnings']
    }
];

const ProjectVersionHistory: React.FC<Props> = ({ project, onClose, onRestore }) => {
  const [selectedVersion, setSelectedVersion] = useState<ArtifactVersion | null>(null);
  
  // Aggregate all versions from artifacts if available, else mock
  // In a real app, you'd flatten project.artifacts versions
  const versions = MOCK_VERSIONS; 

  return (
    <div className="fixed inset-0 bg-[#050505] z-[80] flex flex-col md:flex-row animate-fade-in">
       
       {/* Sidebar: Commit Log */}
       <div className="w-full md:w-80 border-r border-white/10 bg-[#0A0A0C] flex flex-col">
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
             <div className="flex items-center gap-2 text-white font-bold">
                <History size={18} className="text-primary" />
                <span>Time Machine</span>
             </div>
             <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-text-muted">
                <ArrowLeft size={18} />
             </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
             {versions.map((v, i) => (
                <button
                   key={v.id}
                   onClick={() => setSelectedVersion(v)}
                   className={`w-full text-left p-3 rounded-lg border transition-all flex gap-3 ${
                      selectedVersion?.id === v.id ? 'bg-primary/10 border-primary/30' : 'bg-transparent border-transparent hover:bg-white/5'
                   }`}
                >
                   <div className="mt-1 flex flex-col items-center gap-1">
                      <div className={`w-2.5 h-2.5 rounded-full ${i === 0 ? 'bg-primary' : 'bg-white/20'}`}></div>
                      {i !== versions.length - 1 && <div className="w-[1px] h-8 bg-white/5"></div>}
                   </div>
                   <div>
                      <div className="text-sm font-bold text-white mb-0.5">
                         {v.step} Update
                      </div>
                      <div className="text-xs text-text-muted mb-1 line-clamp-1">
                         {v.rationale}
                      </div>
                      <div className="text-[10px] font-mono text-text-dim">
                         {new Date(v.timestamp).toLocaleDateString()}
                      </div>
                   </div>
                </button>
             ))}
          </div>
       </div>

       {/* Main Content: Diff View */}
       <div className="flex-1 bg-[#050505] flex flex-col relative overflow-hidden">
          {selectedVersion ? (
             <>
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#0A0A0C]/50 backdrop-blur">
                   <div>
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">
                         <GitCommit size={20} className="text-text-muted" />
                         Commit {selectedVersion.id.substring(0, 6)}
                      </h2>
                      <p className="text-sm text-text-muted mt-1">{selectedVersion.rationale}</p>
                   </div>
                   <Button variant="secondary" size="sm" onClick={() => onRestore(selectedVersion)}>
                      <RotateCcw size={16} className="mr-2" />
                      Restore this Version
                   </Button>
                </div>

                <div className="flex-1 p-8 overflow-y-auto">
                   <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Changes List */}
                      <Card className="h-fit">
                         <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Changeset</h3>
                         <ul className="space-y-3">
                            {selectedVersion.changes?.map((c, i) => (
                               <li key={i} className="flex items-start text-sm text-gray-300">
                                  <span className="text-primary mr-2">•</span> {c}
                               </li>
                            ))}
                         </ul>
                      </Card>

                      {/* Raw Data Preview */}
                      <Card className="bg-[#0A0A0C] font-mono text-xs text-text-muted overflow-auto max-h-[500px]">
                         <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider font-sans">Artifact Data</h3>
                         <pre>{JSON.stringify(selectedVersion.data, null, 2)}</pre>
                      </Card>
                   </div>
                </div>
             </>
          ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-text-muted">
                <History size={48} className="mb-4 opacity-20" />
                <p>Select a version to inspect details.</p>
             </div>
          )}
       </div>

    </div>
  );
};

export default ProjectVersionHistory;
