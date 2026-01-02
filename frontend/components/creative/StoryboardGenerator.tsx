
import React from 'react';
import { StoryboardShot } from '../../types';
import { Film, Image as ImageIcon, Plus, Settings, Video } from 'lucide-react';
import Card from '../ui/Card';

interface Props {
  shots: StoryboardShot[];
  onAddShot: () => void;
}

const StoryboardGenerator: React.FC<Props> = ({ shots, onAddShot }) => {
  return (
    <div className="h-full p-8 overflow-y-auto no-scrollbar bg-[#08080a]">
       <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
             <div>
                <h2 className="text-4xl font-display font-bold text-white mb-2">Storyboard <span className="text-purple-500">Forge</span></h2>
                <p className="text-text-muted">Visual sequence planner synced with Scene Director.</p>
             </div>
             <button onClick={onAddShot} className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold text-sm transition-colors">
                <Plus size={16} /> Add Frame
             </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
             {shots.map((shot, i) => (
                <Card key={shot.id} className="group hover:border-purple-500/30 transition-all duration-300 bg-[#121214]">
                   <div className="aspect-video bg-black/50 rounded mb-4 relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-50 transition-opacity">
                         <ImageIcon size={32} className="text-white/20" />
                      </div>
                      <div className="absolute top-2 left-2 bg-black/60 backdrop-blur px-2 py-0.5 rounded text-[10px] font-mono text-white border border-white/10">
                         SHOT {String(i + 1).padStart(2, '0')}
                      </div>
                   </div>
                   
                   <h3 className="text-white font-bold mb-1">{shot.title}</h3>
                   <p className="text-xs text-gray-400 mb-4 line-clamp-2">{shot.description}</p>
                   
                   <div className="flex flex-wrap gap-2 mt-auto">
                      <Tag label={shot.angle} />
                      <Tag label={shot.movement} />
                   </div>
                </Card>
             ))}
             
             {/* Empty State */}
             {shots.length === 0 && (
                <div className="col-span-full h-64 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-white/30">
                   <Film size={48} className="mb-4 opacity-50" />
                   <p>No shots generated yet. Start directing.</p>
                </div>
             )}
          </div>
       </div>
    </div>
  );
};

const Tag = ({ label }: { label: string }) => (
   <span className="text-[10px] px-2 py-1 bg-white/5 rounded border border-white/5 text-gray-300">
      {label}
   </span>
);

export default StoryboardGenerator;
