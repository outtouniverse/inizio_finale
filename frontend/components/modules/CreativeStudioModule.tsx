
import React, { useState } from 'react';
import { CreativeData, CreativeAsset } from '../../types';
import Card from '../ui/Card';
import { Palette, Layout, Shirt, Image as ImageIcon, MoreHorizontal, RefreshCw, Wand2 } from 'lucide-react';

interface Props {
  data: CreativeData;
}

const CreativeStudioModule: React.FC<Props> = ({ data }) => {
  const [assets, setAssets] = useState<CreativeAsset[]>(data.assets);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 1500);
  };

  const getIcon = (type: string) => {
    switch (type) {
        case 'LOGO': return <Wand2 size={18} />;
        case 'COLOR': return <Palette size={18} />;
        case 'UI': return <Layout size={18} />;
        case 'MERCH': return <Shirt size={18} />;
        default: return <ImageIcon size={18} />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
        case 'LOGO': return 'text-purple-400 border-purple-500/30 bg-purple-500/10';
        case 'COLOR': return 'text-pink-400 border-pink-500/30 bg-pink-500/10';
        case 'UI': return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
        default: return 'text-green-400 border-green-500/30 bg-green-500/10';
    }
  };

  return (
    <div className="h-full overflow-hidden relative flex flex-col">
        {/* Infinite Canvas Background */}
        <div className="absolute inset-0 bg-[#08080a] pointer-events-none">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-5"></div>
        </div>

        {/* Toolbar */}
        <div className="h-16 border-b border-white/5 bg-black/50 backdrop-blur-md z-20 flex items-center justify-between px-4 md:px-6 flex-none">
            <div className="flex items-center space-x-4">
                <div className="text-sm font-bold text-white uppercase tracking-wider hidden sm:block">Execution Playground</div>
                <div className="h-4 w-[1px] bg-white/10 hidden sm:block"></div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 text-xs text-text-muted">
                    <span className="font-mono">BRAND VOICE:</span>
                    <span className="text-white font-bold">{data.brandVoice}</span>
                </div>
            </div>
            <button 
               onClick={handleRegenerate}
               className={`flex items-center px-3 py-1.5 rounded bg-primary text-black font-bold text-xs uppercase hover:opacity-90 transition-opacity ${isGenerating ? 'animate-pulse' : ''}`}
            >
               <RefreshCw size={14} className={`mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
               {isGenerating ? '...' : 'New Assets'}
            </button>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 md:p-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pb-20">
                {assets.map((asset, i) => (
                    <div key={asset.id} className="group perspective-container">
                        <Card className="h-[320px] flex flex-col relative overflow-hidden border-white/10 hover:border-white/30 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] transition-all duration-500 cube-hover bg-[#121214]">
                            
                            {/* Header */}
                            <div className="flex justify-between items-center mb-4 z-10">
                                <div className={`p-2 rounded-lg border ${getColor(asset.type)}`}>
                                    {getIcon(asset.type)}
                                </div>
                                <button className="text-text-muted hover:text-white">
                                    <MoreHorizontal size={16} />
                                </button>
                            </div>

                            {/* Visual Preview */}
                            <div className="flex-1 bg-black/30 rounded-lg border border-dashed border-white/10 flex items-center justify-center mb-4 relative group-hover:border-white/20 transition-colors overflow-hidden">
                                {asset.type === 'COLOR' ? (
                                    <div className="w-full h-full flex">
                                        <div className="flex-1 bg-[#2EC7FF]"></div>
                                        <div className="flex-1 bg-[#AA66FF]"></div>
                                        <div className="flex-1 bg-[#FFD60A]"></div>
                                    </div>
                                ) : asset.type === 'UI' ? (
                                    <div className="w-3/4 h-3/4 bg-surface border border-white/10 rounded shadow-2xl flex flex-col p-2">
                                        <div className="w-full h-2 bg-white/10 rounded mb-2"></div>
                                        <div className="flex gap-2">
                                            <div className="w-1/3 h-16 bg-white/5 rounded"></div>
                                            <div className="flex-1 space-y-1">
                                                <div className="w-full h-2 bg-white/10 rounded"></div>
                                                <div className="w-2/3 h-2 bg-white/10 rounded"></div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center p-4">
                                        <p className="text-xs font-mono text-text-muted uppercase mb-2">{asset.variant}</p>
                                        <p className="text-sm text-white">{asset.content.length > 30 ? asset.content.substring(0,50) + '...' : asset.content}</p>
                                    </div>
                                )}
                                
                                {/* Hover Actions */}
                                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button className="px-3 py-1.5 bg-white text-black text-xs font-bold rounded hover:scale-105 transition-transform">Edit</button>
                                    <button className="px-3 py-1.5 border border-white text-white text-xs font-bold rounded hover:bg-white/10 transition-colors">Download</button>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="z-10">
                                <h3 className="text-lg font-bold text-white">{asset.title}</h3>
                                <p className="text-xs text-text-muted font-mono mt-1">{asset.variant}</p>
                            </div>

                        </Card>
                    </div>
                ))}

                {/* Add New Placeholder */}
                <div className="h-[320px] border-2 border-dashed border-white/5 rounded-xl flex flex-col items-center justify-center text-text-muted hover:text-white hover:border-white/20 transition-all cursor-pointer opacity-50 hover:opacity-100">
                    <Wand2 size={32} className="mb-4" />
                    <span className="text-sm font-mono uppercase tracking-widest">Generate Asset</span>
                </div>
            </div>
        </div>
    </div>
  );
};

export default CreativeStudioModule;
