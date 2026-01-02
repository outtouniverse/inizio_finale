
import React, { useState, useRef } from 'react';
import { MOCK_PLAYGROUND_ITEMS } from '../../constants';
import { PlaygroundItem } from '../../types';
import { Plus, X, Move, Type, Image as ImageIcon, PenTool, ArrowLeft } from 'lucide-react';

interface Props {
  onClose: () => void;
}

const FounderPlayground: React.FC<Props> = ({ onClose }) => {
  const [items, setItems] = useState<PlaygroundItem[]>(MOCK_PLAYGROUND_ITEMS);
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Dragging logic
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const item = items.find(i => i.id === id);
    if (!item) return;
    setActiveId(id);
    setDragOffset({
       x: e.clientX - item.x,
       y: e.clientY - item.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!activeId) return;
    setItems(prev => prev.map(item => {
       if (item.id === activeId) {
          return {
             ...item,
             x: e.clientX - dragOffset.x,
             y: e.clientY - dragOffset.y
          };
       }
       return item;
    }));
  };

  const handleMouseUp = () => {
    setActiveId(null);
  };

  const addItem = (type: 'NOTE' | 'IMAGE' | 'SKETCH') => {
    const newItem: PlaygroundItem = {
       id: Date.now().toString(),
       type,
       content: type === 'NOTE' ? 'New Thought...' : '',
       x: window.innerWidth / 2 - 100,
       y: window.innerHeight / 2 - 100,
       width: 200,
       height: 150,
       color: type === 'NOTE' ? '#2EC7FF' : undefined
    };
    setItems([...items, newItem]);
  };

  return (
    <div 
      className="fixed inset-0 bg-[#0A0A0C] z-[100] overflow-hidden cursor-crosshair"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Grid Background */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
           backgroundImage: 'radial-gradient(#ffffff 1px, transparent 0)',
           backgroundSize: '40px 40px'
        }}
      ></div>

      {/* Toolbar */}
      <div className="absolute top-4 left-4 z-50 flex flex-col gap-4">
         <button onClick={onClose} className="p-3 bg-black/50 border border-white/10 rounded-full text-white hover:bg-white/10">
            <ArrowLeft size={20} />
         </button>
         <div className="bg-black/50 border border-white/10 rounded-2xl p-2 flex flex-col gap-2 backdrop-blur-md">
            <ToolButton icon={Type} label="Note" onClick={() => addItem('NOTE')} />
            <ToolButton icon={ImageIcon} label="Image" onClick={() => addItem('IMAGE')} />
            <ToolButton icon={PenTool} label="Sketch" onClick={() => addItem('SKETCH')} />
         </div>
      </div>

      {/* Canvas Area */}
      <div 
         ref={containerRef}
         className="w-full h-full relative"
         style={{ transform: `scale(${scale})` }}
      >
         {items.map(item => (
            <div
               key={item.id}
               className="absolute group"
               style={{
                  left: item.x,
                  top: item.y,
                  width: item.width || 200,
                  height: item.height || 'auto',
                  cursor: activeId === item.id ? 'grabbing' : 'grab'
               }}
               onMouseDown={(e) => handleMouseDown(e, item.id)}
            >
               {item.type === 'NOTE' && (
                  <div 
                    className="w-full h-full p-4 rounded-xl shadow-2xl text-black font-medium text-sm flex items-center justify-center text-center relative overflow-hidden"
                    style={{ backgroundColor: item.color || '#fff' }}
                  >
                     {item.content}
                     <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-50 hover:opacity-100 transition-opacity">
                        <Move size={14} />
                     </div>
                  </div>
               )}
               {item.type === 'SKETCH' && (
                  <div className="w-full h-32 border-2 border-dashed border-white/20 rounded-xl flex items-center justify-center text-white/20">
                     <PenTool size={32} />
                  </div>
               )}
            </div>
         ))}
      </div>
      
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 text-xs text-text-muted font-mono pointer-events-none">
         FOUNDER SANDBOX // INFINITE CANVAS
      </div>

    </div>
  );
};

const ToolButton = ({ icon: Icon, label, onClick }: any) => (
   <button 
     onClick={onClick}
     className="p-3 rounded-xl hover:bg-white/10 text-text-muted hover:text-white transition-colors flex flex-col items-center gap-1 w-12"
   >
      <Icon size={20} />
      <span className="text-[9px] uppercase tracking-wider">{label}</span>
   </button>
);

export default FounderPlayground;
