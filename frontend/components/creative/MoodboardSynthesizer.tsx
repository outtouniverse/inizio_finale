
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Lock, Volume2, Maximize, RefreshCw, Plus, X } from 'lucide-react';
import { MoodboardState, MoodboardTile } from '../../types';
import { playTTS } from '../../services/geminiService';

interface Props {
  data: MoodboardState;
  onUpdate: (data: MoodboardState) => void;
}

const MoodboardSynthesizer: React.FC<Props> = ({ data, onUpdate }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);

  const generateTiles = (input: string) => {
    setIsGenerating(true);
    setShowPrompt(false);
    playTTS("Synthesizing aesthetics... one moment.");
    
    setTimeout(() => {
      // Mock Generation Logic
      const newTiles: MoodboardTile[] = Array.from({ length: 6 }).map((_, i) => ({
        id: Date.now() + i + '',
        color: `hsl(${Math.random() * 360}, 60%, ${Math.random() * 40 + 20}%)`,
        caption: ['Neon Isolation', 'Concrete Void', 'Warm Glitch', 'Midnight Rust', 'Velvet Data'][i % 5],
        texture: ''
      }));
      
      onUpdate({
        ...data,
        activeMood: input,
        tiles: newTiles
      });
      setIsGenerating(false);
      playTTS("Moodboard complete. This feels... evocative.");
    }, 2000);
  };

  const handleLock = (id: string) => {
    const isLocked = data.lockedTiles.includes(id);
    const newLocked = isLocked 
      ? data.lockedTiles.filter(tid => tid !== id)
      : [...data.lockedTiles, id];
    onUpdate({ ...data, lockedTiles: newLocked });
  };

  return (
    <div className="h-full w-full flex items-center justify-center relative p-8">
       {/* Floating Island */}
       <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-blue-900/10 to-transparent z-0"></div>
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          {/* Snow particles */}
          {Array.from({ length: 20 }).map((_, i) => (
             <div key={i} className="absolute w-1 h-1 bg-white/20 rounded-full animate-float" style={{ top: `${Math.random()*100}%`, left: `${Math.random()*100}%`, animationDuration: `${Math.random()*10+5}s` }}></div>
          ))}
       </div>

       <AnimatePresence>
         {showPrompt && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            >
               <div className="bg-[#1a1a1a] border border-white/10 p-8 rounded-3xl w-full max-w-md shadow-2xl">
                  <div className="flex justify-between mb-4">
                     <h3 className="text-xl text-white font-bold">Capture the Vibe</h3>
                     <button onClick={() => setShowPrompt(false)}><X size={20} className="text-gray-400"/></button>
                  </div>
                  <input 
                    type="text" 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g. Cyberpunk Winter in Tokyo..."
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white mb-6 focus:border-primary outline-none"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && generateTiles(prompt)}
                  />
                  <button 
                    onClick={() => generateTiles(prompt)}
                    className="w-full py-3 bg-white text-black font-bold rounded-xl hover:scale-[1.02] transition-transform"
                  >
                     Synthesize
                  </button>
               </div>
            </motion.div>
         )}
       </AnimatePresence>

       <div className="w-full max-w-6xl relative z-10">
          
          {/* Controls */}
          <div className="flex justify-between items-center mb-8">
             <div>
                <h2 className="text-4xl font-display font-bold text-white mb-1">{data.activeMood || "Blank Canvas"}</h2>
                <p className="text-xs text-text-muted font-mono uppercase tracking-widest">AI MOODBOARD SYNTHESIZER</p>
             </div>
             <div className="flex gap-4">
                <button onClick={() => playTTS(`Reading moodboard: ${data.activeMood}. A mix of isolation and warmth.`)} className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"><Volume2 size={20}/></button>
                <button onClick={() => setShowPrompt(true)} className="p-3 rounded-full bg-primary text-black hover:scale-110 transition-transform shadow-[0_0_15px_var(--primary)]"><Plus size={20}/></button>
             </div>
          </div>

          {/* Grid */}
          {isGenerating ? (
             <div className="h-[500px] flex items-center justify-center">
                <div className="text-center">
                   <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
                   <p className="text-primary font-mono text-sm animate-pulse">DREAMING...</p>
                </div>
             </div>
          ) : (
             <div className="grid grid-cols-2 md:grid-cols-3 gap-6 h-[500px]">
                {data.tiles.map((tile, i) => (
                   <motion.div 
                     key={tile.id}
                     initial={{ opacity: 0, y: 20, rotate: (Math.random() - 0.5) * 5 }}
                     animate={{ opacity: 1, y: 0, rotate: 0 }}
                     transition={{ delay: i * 0.1 }}
                     className="relative group rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all hover:scale-[1.02]"
                     style={{ backgroundColor: tile.color }}
                   >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                         <button onClick={() => handleLock(tile.id)} className={`p-2 rounded-full backdrop-blur-md ${data.lockedTiles.includes(tile.id) ? 'bg-primary text-black' : 'bg-black/50 text-white'}`}>
                            <Lock size={14} />
                         </button>
                      </div>
                      <div className="absolute bottom-4 left-4">
                         <p className="text-white font-bold text-lg drop-shadow-md">{tile.caption}</p>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); playTTS(tile.caption); }}
                        className="absolute bottom-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/40"
                      >
                         <Volume2 size={14} className="text-white" />
                      </button>
                   </motion.div>
                ))}
                {data.tiles.length === 0 && (
                   <div onClick={() => setShowPrompt(true)} className="col-span-full h-full border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-white/30 hover:text-white hover:border-white/30 transition-all cursor-pointer">
                      <Sparkles size={48} className="mb-4" />
                      <p className="text-lg font-light">Click to Dream</p>
                   </div>
                )}
             </div>
          )}

       </div>
    </div>
  );
};

export default MoodboardSynthesizer;
