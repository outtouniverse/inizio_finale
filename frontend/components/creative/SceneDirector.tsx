
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Sliders, Mic, Play, Pause, SkipBack, SkipForward, Film, Aperture, Activity } from 'lucide-react';
import { CameraConfig, StoryboardShot } from '../../types';
import { playTTS } from '../../services/geminiService';

interface Props {
  config: CameraConfig;
  shots: StoryboardShot[];
  onConfigChange: (cfg: CameraConfig) => void;
}

const SceneDirector: React.FC<Props> = ({ config, shots, onConfigChange }) => {
  const [activeShot, setActiveShot] = useState<string>(shots[0]?.id || '');

  const handleSliderChange = (key: keyof CameraConfig, val: any) => {
    onConfigChange({ ...config, [key]: val });
    if (key === 'motion') {
       playTTS(`Motion intensity set to ${val}%.`);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#050505] text-white relative overflow-hidden">
       {/* Cinematic Ambience */}
       <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
       <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_20px_#3b82f6]"></div>

       <div className="flex-1 flex overflow-hidden relative z-10">
          
          {/* LEFT PANEL: CAMERA BRAIN */}
          <div className="w-80 bg-black/80 backdrop-blur-xl border-r border-white/10 p-6 flex flex-col overflow-y-auto">
             <h3 className="text-xs font-mono text-blue-400 uppercase tracking-widest mb-8 flex items-center">
                <Aperture size={14} className="mr-2" /> Camera Brain
             </h3>

             <div className="space-y-8">
                <ControlGroup label="Camera Type">
                   <div className="grid grid-cols-2 gap-2">
                      {['Handheld', 'Steadicam', 'Drone', 'Tripod'].map(t => (
                         <button
                           key={t}
                           onClick={() => { onConfigChange({ ...config, type: t as any }); playTTS(`${t} mode engaged.`); }}
                           className={`px-3 py-2 rounded text-xs border transition-all ${config.type === t ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
                         >
                            {t}
                         </button>
                      ))}
                   </div>
                </ControlGroup>

                <ControlGroup label="Lens">
                   <div className="flex justify-between bg-white/5 rounded p-1 border border-white/10">
                      {['16mm', '35mm', '50mm', '85mm'].map(l => (
                         <button
                           key={l}
                           onClick={() => onConfigChange({ ...config, lens: l as any })}
                           className={`px-3 py-1 rounded text-[10px] font-mono transition-all ${config.lens === l ? 'bg-white text-black font-bold' : 'text-gray-400 hover:text-white'}`}
                         >
                            {l}
                         </button>
                      ))}
                   </div>
                </ControlGroup>

                <ControlGroup label={`Motion Intensity: ${config.motion}%`}>
                   <input 
                     type="range" 
                     min="0" 
                     max="100" 
                     value={config.motion} 
                     onChange={(e) => handleSliderChange('motion', parseInt(e.target.value))}
                     className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                   />
                </ControlGroup>
             </div>

             <div className="mt-auto pt-8">
                <div className="p-4 bg-blue-900/10 border border-blue-500/20 rounded-lg">
                   <div className="flex items-center gap-2 text-blue-400 mb-2">
                      <Activity size={14} className="animate-pulse" />
                      <span className="text-[10px] uppercase font-bold">Live Feedback</span>
                   </div>
                   <p className="text-xs text-blue-200/70 leading-relaxed">
                      "For a {config.type} shot on {config.lens}, consider slowing down the motion to emphasize scale."
                   </p>
                </div>
             </div>
          </div>

          {/* CENTER: VIEWPORT */}
          <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden group">
             {/* Grid Overlay */}
             <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
             
             {/* Viewport Frame */}
             <div className="aspect-video w-[80%] border border-white/20 relative shadow-2xl bg-[#0a0a0a]">
                <div className="absolute top-4 left-4 text-[10px] font-mono text-white/50">REC [ ● ]</div>
                <div className="absolute bottom-4 right-4 text-[10px] font-mono text-white/50">{config.fps} FPS</div>
                
                {/* Mock Scene Content */}
                <div className="w-full h-full flex items-center justify-center">
                   <p className="text-white/20 font-light text-2xl">SCENE PREVIEW // {activeShot}</p>
                </div>

                {/* Crosshairs */}
                <div className="absolute top-1/2 left-1/2 w-4 h-4 border-l border-t border-white/30 -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute top-1/2 left-1/2 w-4 h-4 border-r border-b border-white/30 -translate-x-1/2 -translate-y-1/2"></div>
             </div>
          </div>

          {/* RIGHT: NOTES BUBBLE */}
          <div className="absolute right-8 top-8 z-20">
             <button 
               onClick={() => playTTS("Director's note: Keep the lighting moody, emphasize the shadows.")}
               className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:scale-110 transition-transform"
             >
                <Mic size={20} />
             </button>
          </div>

       </div>

       {/* BOTTOM: TIMELINE */}
       <div className="h-32 bg-[#0a0a0a] border-t border-white/10 p-4 flex items-center gap-4">
          <div className="flex items-center gap-2 mr-4">
             <button className="p-2 hover:text-white text-gray-400"><SkipBack size={16}/></button>
             <button className="p-3 rounded-full bg-white text-black hover:scale-105 transition-transform"><Play size={16} fill="currentColor" /></button>
             <button className="p-2 hover:text-white text-gray-400"><SkipForward size={16}/></button>
          </div>
          
          <div className="flex-1 flex gap-2 overflow-x-auto no-scrollbar h-full items-center">
             {shots.map((shot, i) => (
                <div 
                  key={shot.id} 
                  onClick={() => { setActiveShot(shot.id); playTTS(`Shot ${i+1}: ${shot.title}`); }}
                  className={`flex-none w-32 h-20 rounded border cursor-pointer relative group transition-all ${activeShot === shot.id ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-white/10 hover:border-white/30 bg-white/5'}`}
                >
                   <div className="absolute bottom-1 left-2 text-[9px] font-bold text-white truncate max-w-[90%]">{i+1}. {shot.title}</div>
                   <div className="absolute top-1 right-1">
                      <Film size={10} className="text-white/30" />
                   </div>
                </div>
             ))}
             <button className="flex-none w-32 h-20 rounded border border-dashed border-white/10 flex items-center justify-center text-white/20 hover:text-white hover:border-white/30 transition-colors">
                <span className="text-xs">+ Shot</span>
             </button>
          </div>
       </div>
    </div>
  );
};

const ControlGroup = ({ label, children }: any) => (
   <div>
      <label className="text-[10px] font-bold text-gray-500 uppercase mb-3 block">{label}</label>
      {children}
   </div>
);

export default SceneDirector;
