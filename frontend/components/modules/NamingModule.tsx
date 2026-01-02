
import React from 'react';
import { NamingData } from '../../types';
import Card from '../ui/Card';
import { Type, Palette, Globe, Hash } from 'lucide-react';

interface Props {
  data: NamingData;
}

const NamingModule: React.FC<Props> = ({ data }) => {
  return (
    <div className="h-full overflow-y-auto no-scrollbar p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-display font-bold text-white mb-2">Identity <span className="text-primary">Layer</span></h2>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5">
             <span className="text-xs font-mono text-text-muted uppercase">ARCHETYPE:</span>
             <span className="text-xs font-mono text-white uppercase font-bold">{data.brandArchetype}</span>
          </div>
        </div>

        {/* Name Options - Horizontal Scroll / Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
           {data.options.map((opt, i) => (
             <div key={i} className="group perspective-container">
                <Card className="h-[300px] flex flex-col justify-between hover:bg-white/5 transition-colors border-white/10 hover:border-primary/30 relative overflow-hidden cube-hover">
                   
                   {/* Background Gradient based on palette */}
                   <div 
                      className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity"
                      style={{ backgroundColor: data.colorPalette[i % data.colorPalette.length] }}
                   ></div>

                   <div>
                      <div className="flex justify-between items-start mb-4">
                         <span className="text-[10px] font-mono text-text-muted uppercase border border-white/10 px-2 py-1 rounded bg-black/40">{opt.vibe}</span>
                         {opt.available ? (
                            <span className="text-[10px] text-green-400 flex items-center"><Globe size={10} className="mr-1"/> Available</span>
                         ) : (
                            <span className="text-[10px] text-red-400 flex items-center"><Globe size={10} className="mr-1"/> Taken</span>
                         )}
                      </div>
                      <h3 className="text-4xl font-bold text-white mb-2 tracking-tight">{opt.name}</h3>
                      <p className="text-lg text-primary font-light italic">"{opt.tagline}"</p>
                   </div>

                   <div className="mt-6 pt-6 border-t border-white/5">
                      <p className="text-xs text-text-muted leading-relaxed">{opt.rationale}</p>
                   </div>
                </Card>
             </div>
           ))}
        </div>

        {/* Palette & Mood */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <Card>
              <div className="flex items-center space-x-3 mb-6">
                 <Palette size={20} className="text-white" />
                 <h3 className="font-bold text-white">System Palette</h3>
              </div>
              <div className="flex h-24 rounded-xl overflow-hidden border border-white/10">
                 {data.colorPalette.map((color, i) => (
                    <div key={i} className="flex-1 flex items-end justify-center p-2 hover:flex-[2] transition-all duration-300 cursor-pointer group relative" style={{ backgroundColor: color }}>
                       <span className="text-[10px] font-mono bg-black/50 text-white px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">{color}</span>
                    </div>
                 ))}
              </div>
           </Card>
           
           <Card className="flex flex-col justify-center items-center text-center bg-surface/50">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
                 <Type size={24} className="text-white" />
              </div>
              <p className="text-sm text-text-muted max-w-xs">
                 "The {data.brandArchetype} archetype suggests a visual identity that uses {data.options[0].vibe} typography and high-contrast imagery."
              </p>
           </Card>
        </div>

      </div>
    </div>
  );
};

export default NamingModule;
