
import React, { useState, useRef, useEffect } from 'react';
import { DeckSlide } from '../../types';
import { Layers, Play, Download, Palette, Wand2, ChevronRight, MousePointer2, ArrowLeft, ArrowRight as ArrowRightIcon, Loader2, Plus } from 'lucide-react';
import Button from '../ui/Button';
import jsPDF from 'jspdf';

interface Props {
  data: DeckSlide[];
}

type Theme = 'NEO_NOIR' | 'LUMEN' | 'CARBON' | 'COSMIC';

const DeckModule: React.FC<Props> = ({ data }) => {
  const safeData = Array.isArray(data) ? data : [];
  const [slides, setSlides] = useState<DeckSlide[]>(safeData);
  const [theme, setTheme] = useState<Theme>('NEO_NOIR');
  const [activeSlide, setActiveSlide] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [isRewriting, setIsRewriting] = useState(false);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
      if (Array.isArray(data)) {
          setSlides(data);
      }
  }, [data]);

  // --- Scroll Logic ---
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = window.innerWidth < 600 ? window.innerWidth * 0.9 : 500;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; 
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  // --- Actions ---
  const handleAddSlide = () => {
    const newSlide: DeckSlide = { title: "New Slide", content: ["Point 1", "Point 2"] };
    setSlides([...slides, newSlide]);
    setTimeout(() => scroll('right'), 100);
  };

  const handleRewrite = () => {
    setIsRewriting(true);
    setTimeout(() => {
      setIsRewriting(false);
      const updated = [...slides];
      if (updated[activeSlide]) {
         updated[activeSlide].content = updated[activeSlide].content.map(c => c + " (Refined)");
         setSlides(updated);
      }
    }, 1500);
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      try {
        const doc = new jsPDF();
        slides.forEach((slide, i) => {
            if (i > 0) doc.addPage();
            doc.setFillColor(10, 10, 12);
            doc.rect(0, 0, 210, 297, 'F');
            doc.setTextColor(46, 199, 255); 
            doc.setFontSize(24);
            doc.text(slide.title, 20, 30);
            doc.setTextColor(240, 240, 240);
            doc.setFontSize(14);
            slide.content.forEach((point, idx) => {
                doc.text(`• ${point}`, 20, 60 + (idx * 15));
            });
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.text("Made with Inizio", 170, 280);
        });
        doc.save("inizio_pitch_deck.pdf");
      } catch (e) {
          console.error("Export failed", e);
      }
      setIsExporting(false);
    }, 1000);
  };

  const getThemeClasses = () => {
    switch (theme) {
      case 'LUMEN': return 'bg-white/10 backdrop-blur-xl border-white/20 text-white';
      case 'CARBON': return 'bg-[#1a1a1a] border-white/5 text-gray-200 bg-[url("https://www.transparenttextures.com/patterns/carbon-fibre.png")]';
      case 'COSMIC': return 'bg-gradient-to-br from-[#1a237e] to-black border-blue-500/30 text-blue-100';
      default: return 'bg-black border-primary/20 text-white shadow-[0_0_30px_rgba(46,199,255,0.1)]';
    }
  };

  return (
    <div className="h-full flex flex-col relative bg-black overflow-hidden">
      
      {/* Toolbar */}
      <div className="flex-none h-auto min-h-16 py-2 border-b border-white/5 flex flex-wrap md:flex-nowrap items-center justify-between px-4 md:px-6 bg-black/50 backdrop-blur z-20 gap-2">
         <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center space-x-2 text-text-muted">
               <Layers size={16} />
               <span className="font-mono text-xs uppercase tracking-wider">Forge</span>
            </div>
            <div className="h-4 w-[1px] bg-white/10 hidden md:block"></div>
            <div className="flex items-center space-x-2">
               {['NEO_NOIR', 'LUMEN', 'CARBON', 'COSMIC'].map((t) => (
                 <button 
                   key={t}
                   onClick={() => setTheme(t as Theme)}
                   className={`w-4 h-4 md:w-6 md:h-6 rounded-full border ${theme === t ? 'border-white ring-2 ring-primary/50' : 'border-transparent'} hover:scale-110 transition-all`}
                   style={{
                     background: t === 'LUMEN' ? '#ccc' : t === 'CARBON' ? '#333' : t === 'COSMIC' ? 'blue' : 'black'
                   }}
                 />
               ))}
            </div>
         </div>
         <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
            <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleRewrite}
                disabled={isRewriting}
                className="hidden sm:flex text-xs"
            >
                {isRewriting ? <Loader2 size={12} className="animate-spin mr-1"/> : <Wand2 size={12} className="mr-1" />}
                Rewrite
            </Button>
            <Button 
                variant="primary" 
                size="sm"
                onClick={handleExport}
                disabled={isExporting}
                className="text-xs"
            >
                {isExporting ? <Loader2 size={12} className="animate-spin mr-1"/> : <Download size={12} className="mr-1" />}
                Export
            </Button>
         </div>
      </div>

      {/* Navigation Arrows (Absolute) */}
      <button onClick={() => scroll('left')} className="absolute left-2 top-1/2 -translate-y-1/2 z-30 p-2 md:p-3 bg-black/50 rounded-full border border-white/10 hover:bg-white/10 text-white transition-colors backdrop-blur-md">
          <ArrowLeft size={20} />
      </button>
      <button onClick={() => scroll('right')} className="absolute right-2 top-1/2 -translate-y-1/2 z-30 p-2 md:p-3 bg-black/50 rounded-full border border-white/10 hover:bg-white/10 text-white transition-colors backdrop-blur-md">
          <ArrowRightIcon size={20} />
      </button>

      {/* Main Storyboard Rail */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-x-auto overflow-y-hidden flex items-center px-4 md:px-20 gap-4 md:gap-8 no-scrollbar relative cursor-grab active:cursor-grabbing snap-x snap-mandatory"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
         {/* Horizontal Background Line */}
         <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/5 -z-10 pointer-events-none"></div>

         {slides.length === 0 ? (
             <div className="flex items-center justify-center w-full h-full">
                 <p className="text-text-muted">No slides generated yet.</p>
             </div>
         ) : slides.map((slide, idx) => (
           <div 
             key={idx}
             className={`flex-none w-[85vw] max-w-[600px] aspect-video transition-all duration-500 group perspective-container snap-center
                ${activeSlide === idx ? 'scale-100 md:scale-105 z-10' : 'scale-90 md:scale-95 opacity-50 hover:opacity-80'}
             `}
             onClick={() => setActiveSlide(idx)}
           >
              <div className={`w-full h-full rounded-xl p-4 md:p-8 flex flex-col relative overflow-hidden border transition-all duration-500 ${getThemeClasses()} cube-hover`}>
                 <div className="flex justify-between items-start mb-4 md:mb-6">
                    <span className="text-[10px] md:text-xs font-mono opacity-50 uppercase tracking-widest">Slide {String(idx + 1).padStart(2, '0')}</span>
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white/10 flex items-center justify-center">
                       <div className="w-1.5 h-1.5 bg-current rounded-full"></div>
                    </div>
                 </div>
                 
                 <h2 className="text-xl md:text-3xl font-display font-bold mb-4 md:mb-6 leading-tight line-clamp-2">{slide.title}</h2>
                 
                 <div className="space-y-2 md:space-y-3 flex-1 overflow-y-auto">
                    {slide.content && slide.content.map((point, i) => (
                      <div key={i} className="flex items-start space-x-3 opacity-80">
                         <ChevronRight size={14} className="mt-1 flex-none opacity-50" />
                         <p className="text-sm md:text-lg font-light leading-relaxed">{point}</p>
                      </div>
                    ))}
                 </div>

                 {/* Watermark */}
                 <div className="absolute bottom-2 right-4 opacity-30 text-[8px] font-mono uppercase tracking-widest flex items-center">
                    Made with Inizio
                 </div>
              </div>
           </div>
         ))}
         
         {/* Add Slide Button */}
         <div 
            className="flex-none w-20 h-20 md:w-32 md:h-32 rounded-full border border-dashed border-white/10 flex items-center justify-center text-text-muted hover:text-white hover:border-white/30 cursor-pointer transition-all hover:scale-110 snap-center"
            onClick={handleAddSlide}
        >
            <div className="flex flex-col items-center">
               <Plus size={24} />
               <span className="text-[10px] font-mono uppercase mt-1">Add</span>
            </div>
         </div>

         {/* Spacer */}
         <div className="w-4 md:w-20 flex-none"></div>
      </div>

    </div>
  );
};

export default DeckModule;
