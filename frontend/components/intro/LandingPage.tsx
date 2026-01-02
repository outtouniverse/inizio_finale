
import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useSpring, useMotionValue, useTransform, useMotionTemplate } from 'framer-motion';
import { ArrowRight, PlayCircle, Box, Activity, Globe, Terminal, Layers, Shield, Check, Cpu, Database, Map, Play, ChevronRight, MousePointer2, Scan, MessageSquare, Calendar, Search, Bell } from 'lucide-react';
import Button from '../ui/Button';
import HeroBeam from '../ui/HeroBeam';

interface LandingPageProps {
  onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <div ref={containerRef} className="relative w-full h-full bg-[#050505] text-white overflow-y-auto overflow-x-hidden selection:bg-primary/30 selection:text-white scroll-smooth font-sans perspective-container">
      
      {/* Global Noise & Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[50] opacity-[0.04] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay"></div>
      
      {/* Reading Progress */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-secondary to-primary z-[100] origin-left shadow-[0_0_10px_rgba(46,199,255,0.5)]"
        style={{ scaleX }}
      />

      {/* Floating Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-12 py-4 md:py-6 flex justify-between items-center pointer-events-none mix-blend-difference backdrop-blur-[1px]">
        <div className="flex items-center space-x-3 pointer-events-auto cursor-pointer group" onClick={onEnter}>
          <div className="relative w-4 h-4">
             <div className="absolute inset-0 bg-white rounded-full group-hover:bg-primary transition-colors shadow-[0_0_15px_rgba(255,255,255,0.5)] animate-pulse"></div>
             <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-20"></div>
          </div>
          <span className="font-display font-bold tracking-[0.2em] text-xs md:text-sm group-hover:text-primary transition-colors">INIZIO // OS</span>
        </div>
        <div className="flex items-center gap-6">
            <span className="hidden md:inline text-[10px] font-mono text-white/50 uppercase tracking-widest">System Status: Online</span>
            <Button variant="glass" size="sm" onClick={onEnter} className="flex pointer-events-auto border-white/10 hover:border-white/30 hover:bg-white/10 backdrop-blur-xl shadow-2xl text-xs md:text-sm px-4 md:px-6">
            Initialize
            </Button>
        </div>
      </nav>

      {/* --- SECTIONS --- */}
      <HeroSection onEnter={onEnter} />
      <InfiniteMarquee />
      <SystemBentoGrid />
      <PhilosophyParallax />
      <LiveTerminalDemo />
      <FeatureDeepDive />
      <PricingSection />
      <TestimonialLog />
      <FinalCTA onEnter={onEnter} />
      <Footer />

    </div>
  );
};

const HeroSection = ({ onEnter }: { onEnter: () => void }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 100, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 100, damping: 20 });

  const contentX = useTransform(smoothX, [-1, 1], [-20, 20]);
  const contentY = useTransform(smoothY, [-1, 1], [-20, 20]);

  return (
    <section className="relative min-h-[100dvh] w-full flex flex-col justify-center items-center overflow-hidden bg-[#050505] text-white selection:bg-blue-500/30">
       <div className="absolute inset-0 z-0 opacity-95">
         <HeroBeam />
      </div>
      
      <motion.div 
        className="container relative z-10 px-4 md:px-12 max-w-5xl mx-auto flex flex-col items-center text-center pt-20"
        style={{ x: contentX, y: contentY }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6 md:mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs md:text-sm text-blue-200 backdrop-blur-md"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          v2.0 is now live
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.2, 1, 0.2, 1] }}
          className="text-4xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1] mb-6 md:mb-8"
        >
          <span className="block text-white/60 text-2xl md:text-5xl font-medium mb-2 md:mb-4 tracking-normal">
            This is where founders begin
          </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40">
            Your AI Co-founder
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.2, 1, 0.2, 1] }}
          className="text-base md:text-xl text-gray-400 max-w-2xl leading-relaxed mb-8 md:mb-12 px-4"
        >
          Inizio replaces your fragmented tool stack. Strategy, Validation, Product Management, and Roadmap in one OS.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto px-4"
        >
          <button 
            onClick={onEnter}
            className="group relative h-12 md:h-14 w-full sm:w-48 overflow-hidden rounded-full bg-white text-black font-medium shadow-[0_0_50px_-12px_rgba(255,255,255,0.5)] transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="relative z-10 flex items-center justify-center gap-2 text-sm md:text-base">
              Try Now <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </span>
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-blue-100 to-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </button>

          <button 
            onClick={onEnter}
            className="group h-12 md:h-14 w-full sm:w-48 rounded-full border border-white/10 bg-white/5 text-white font-medium backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/20 active:scale-[0.98]"
          >
            <span className="flex items-center justify-center gap-2 text-sm md:text-base">
              <PlayCircle size={18} className="text-blue-400 group-hover:text-blue-300" /> 
              Watch Demo
            </span>
          </button>
        </motion.div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent z-20 pointer-events-none"></div>
    </section>
  );
};

const InfiniteMarquee = () => {
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 150, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const radiusRaw = useMotionValue(0);
  const radiusSmooth = useSpring(radiusRaw, { damping: 20, stiffness: 100 });

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  React.useEffect(() => {
    if (isHovered) {
      radiusRaw.set(300);
    } else {
      radiusRaw.set(0);
    }
  }, [isHovered, radiusRaw]);

  const maskImage = useMotionTemplate`radial-gradient(${radiusSmooth}px circle at ${smoothX}px ${smoothY}px, black, transparent)`;

  const TEXT = "VALIDATE • BUILD • SCALE • PIVOT • SHIP • ";
  const REPEATS = 6; 
  const contentArr = Array(REPEATS).fill(TEXT);

  return (
    <div
      className="relative w-full h-[120px] md:h-[200px] bg-[#050505] border-y border-white/10 flex items-center overflow-hidden "
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 flex items-center opacity-20 mix-blend-overlay z-0 pointer-events-none">
        <ScrollingText content={contentArr} className="text-neutral-500" />
      </div>

      <motion.div
        className="absolute inset-0 flex items-center z-10 pointer-events-none"
        style={{ maskImage, WebkitMaskImage: maskImage }}
      >
        <ScrollingText 
          content={contentArr} 
          className="text-white drop-shadow-[0_0_12px_rgba(46,199,255,0.8)]" 
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505] z-20 pointer-events-none" />
    </div>
  );
};

const TextItem: React.FC<{ text: string }> = ({ text }) => (
  <span className="text-4xl md:text-8xl font-black tracking-tighter font-display px-4 select-none">
    {text}
  </span>
);

const ScrollingText = ({ content, className }: { content: string[], className?: string }) => {
  return (
    <motion.div
      className={`flex whitespace-nowrap ${className}`}
      animate={{ x: "-50%" }} 
      transition={{
        duration: 30,
        ease: "linear",
        repeat: Infinity,
      }}
      style={{ width: "fit-content" }}
    >
      {content.map((text, i) => (
        <TextItem key={`1-${i}`} text={text} />
      ))}
      {content.map((text, i) => (
        <TextItem key={`2-${i}`} text={text} />
      ))}
    </motion.div>
  );
};

const SystemBentoGrid = () => {
  return (
    <section className="py-20 md:py-40 px-4 md:px-6 bg-[#050505] relative">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-12 md:mb-24 md:flex justify-between items-end border-b border-white/5 pb-12">
           <div>
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="flex items-center space-x-3 mb-4"
             >
                <div className="w-8 h-[1px] bg-primary"></div>
                <span className="text-primary font-mono text-xs uppercase tracking-widest">System Modules</span>
             </motion.div>
             <motion.h2 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.1 }}
               className="text-4xl md:text-7xl font-display font-bold mb-6"
             >
                The Architect.
             </motion.h2>
             <motion.p 
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               viewport={{ once: true }}
               transition={{ delay: 0.2 }}
               className="text-text-muted max-w-2xl text-lg md:text-xl font-light"
             >
                A complete suite of agentic modules designed to replace your first 3 hires. 
                <span className="text-white"> Strategy, Product, and Engineering in one core.</span>
             </motion.p>
           </div>
           <div className="hidden md:block text-right">
              <div className="font-mono text-xs text-primary tracking-widest uppercase mb-2">Status</div>
              <div className="flex items-center gap-2 text-white bg-white/5 px-4 py-2 rounded-full border border-white/10">
                 <Activity size={16} className="text-success animate-pulse" />
                 <span>All Systems Operational</span>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-auto md:grid-rows-3 gap-6 h-auto">
           
           {/* 1. Validation Engine (Large, Interactive) */}
           <BentoCard className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-primary/5 to-transparent group min-h-[400px] md:h-auto">
              <div className="absolute top-6 right-6 p-2 bg-white/5 rounded-full text-primary border border-white/10"><Activity size={24}/></div>
              
              <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none">
                 <div className="w-[200px] md:w-[300px] h-[200px] md:h-[300px] border border-primary/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
                 <div className="w-[150px] md:w-[200px] h-[150px] md:h-[200px] border border-dashed border-white/20 rounded-full absolute animate-[spin_15s_linear_infinite_reverse]"></div>
              </div>

              <div className="mt-auto relative z-10">
                 <div className="mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-4 group-hover:translate-y-0">
                    <div className="flex items-center space-x-2 text-xs font-mono text-primary mb-2">
                        <Scan size={14} />
                        <span>SCANNING MARKET SIGNALS...</span>
                    </div>
                 </div>
                 <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Validation Engine</h3>
                 <p className="text-text-muted mb-6 text-base md:text-lg">Runs "Fake Door" tests, analyzes competitor weaknesses, and scores your idea's viability before you build.</p>
                 <div className="flex flex-wrap gap-2">
                    <Badge text="Market Signal" />
                    <Badge text="Sentiment Analysis" />
                    <Badge text="Competitor Recon" />
                 </div>
              </div>
           </BentoCard>

           {/* 2. Geo (Tall) */}
           <BentoCard className="md:col-span-1 md:row-span-3 bg-surface/30 group min-h-[400px] md:h-auto">
              <div className="h-full flex flex-col items-center text-center pt-12 relative">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 
                 <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border border-white/10 relative mb-8 md:mb-12 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                    <Globe className="text-blue-400 animate-pulse" size={48} />
                    <div className="absolute inset-0 border-t border-blue-500/50 rounded-full animate-spin"></div>
                    <div className="absolute -inset-4 border border-dashed border-white/5 rounded-full animate-spin-slow"></div>
                 </div>
                 
                 <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Geo Intelligence</h3>
                 <p className="text-text-muted text-sm mb-6 px-4 leading-relaxed">Find the perfect launch market based on regulatory & cost data.</p>
                 
                 <div className="mt-auto w-full p-4">
                    <div className="w-full bg-white/5 rounded border border-white/5 p-3 flex items-center justify-between">
                        <span className="text-xs font-mono text-white/60">TARGET:</span>
                        <span className="text-xs font-bold text-blue-400">SINGAPORE</span>
                    </div>
                 </div>
              </div>
           </BentoCard>

           {/* 3. Tech Stack (Square) */}
           <BentoCard className="md:col-span-1 md:row-span-1 bg-surface/30 group hover:bg-white/[0.02] min-h-[200px] md:h-auto">
              <Terminal className="text-white mb-6 group-hover:text-primary transition-colors" size={32} />
              <h3 className="text-xl font-bold text-white">Tech Stack</h3>
              <p className="text-text-muted text-xs mt-2 group-hover:text-white/70 transition-colors">Auto-architects your codebase. Recommends frameworks.</p>
           </BentoCard>

           {/* 4. Risks (Square) */}
           <BentoCard className="md:col-span-1 md:row-span-1 bg-red-900/5 border-red-500/10 hover:border-red-500/40 group min-h-[200px] md:h-auto">
              <div className="absolute right-4 top-4 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
              <Shield className="text-red-500 mb-6 group-hover:scale-110 transition-transform" size={32} />
              <h3 className="text-xl font-bold text-white">Risk Radar</h3>
              <p className="text-red-200/50 text-xs mt-2">Detects blindspots instantly. Mitigation strategies included.</p>
           </BentoCard>

           {/* 5. Pitch Deck (Wide) */}
           <BentoCard className="md:col-span-2 md:row-span-1 bg-surface/30 flex flex-col md:flex-row items-center justify-between pr-0 md:pr-12 group overflow-hidden min-h-[300px] md:h-auto">
              <div className="relative z-10 text-center md:text-left mb-6 md:mb-0">
                <Layers className="text-yellow-400 mb-4 mx-auto md:mx-0" size={32} />
                <h3 className="text-2xl font-bold text-white">Pitch Forge</h3>
                <p className="text-text-muted text-sm mt-2">Generates investor-ready slides. Export to PDF/PPTX.</p>
              </div>
              
              <div className="hidden md:flex space-x-[-40px] perspective-container transform rotate-y-12 group-hover:translate-x-[-20px] transition-transform duration-500">
                 <div className="w-32 h-40 bg-[#1a1a1a] border border-white/20 rounded-lg transform rotate-[-10deg] shadow-xl z-0"></div>
                 <div className="w-32 h-40 bg-[#202020] border border-white/20 rounded-lg transform rotate-[-5deg] shadow-xl z-10 flex items-center justify-center">
                    <div className="w-16 h-1 bg-white/20 rounded"></div>
                 </div>
                 <div className="w-32 h-40 bg-[#252525] border border-primary/30 rounded-lg transform rotate-[0deg] shadow-2xl z-20 flex flex-col p-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-full mb-2"></div>
                    <div className="w-full h-2 bg-white/10 rounded mb-1"></div>
                    <div className="w-2/3 h-2 bg-white/10 rounded"></div>
                 </div>
              </div>
           </BentoCard>

           {/* 6. MVP (Square) */}
           <BentoCard className="md:col-span-1 md:row-span-1 bg-surface/30 group hover:bg-white/[0.02] min-h-[200px] md:h-auto">
              <Box className="text-secondary mb-6 group-hover:rotate-12 transition-transform" size={32} />
              <h3 className="text-xl font-bold text-white">MVP Builder</h3>
              <p className="text-text-muted text-xs mt-2">Scope & Sprints. Prioritized by impact.</p>
           </BentoCard>

        </div>
      </div>
    </section>
  );
};

const BentoCard = ({ children, className }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    whileHover={{ scale: 0.99 }}
    className={`relative p-6 md:p-8 rounded-3xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-500 flex flex-col shadow-lg hover:shadow-2xl ${className}`}
  >
    <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none"></div>
    {children}
  </motion.div>
);

const Badge = ({ text }: { text: string }) => (
  <span className="px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono uppercase tracking-wider text-white/80 hover:bg-white/10 transition-colors cursor-default">
    {text}
  </span>
);

const PhilosophyParallax = () => {
  return (
    <section className="py-20 md:py-40 px-4 md:px-6 bg-black relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none opacity-[0.03]">
         <h1 className="text-[20vw] font-display font-bold leading-none">NO CODE</h1>
      </div>

      <div className="max-w-6xl mx-auto text-center z-10 relative">
         <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-8xl font-display font-bold leading-tight mb-12 md:mb-20"
         >
           The Solo Founder <br/>
           is a <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Myth.</span>
         </motion.h2>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 text-left">
            <PhilosophyPoint 
               icon={Activity} 
               title="Velocity is Leverage" 
               desc="Speed is the only leverage you have against incumbents. Inizio automates the slow parts of building so you can focus on the vision." 
               delay={0.2}
            />
            <PhilosophyPoint 
               icon={Cpu} 
               title="Synthetic Intelligence" 
               desc="You don't need another tool. You need a partner that challenges your biases, calculates risks, and architects solutions." 
               delay={0.4}
            />
         </div>
      </div>
    </section>
  );
};

const PhilosophyPoint = ({ icon: Icon, title, desc, delay }: any) => (
   <motion.div 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.8 }}
      className="max-w-lg mx-auto"
   >
      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 md:mb-8 border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
         <Icon size={32} className="text-white" />
      </div>
      <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">{title}</h3>
      <p className="text-lg md:text-xl text-gray-400 leading-relaxed font-light">{desc}</p>
   </motion.div>
);

const LiveTerminalDemo = () => {
  const [lines, setLines] = useState<string[]>([
    "> INITIALIZING CORE SYSTEMS...",
    "> CONNECTING TO MARKET DATA API [SECURE]...",
    "> ANALYZING 4 KEY COMPETITORS...",
    "> DETECTING WEAKNESS: 'POOR MOBILE UX'...",
    "> SYNTHESIZING OPPORTUNITY MATRIX...",
    "> ARCHITECTING MVP BLUEPRINT...",
    "> GENERATING REACT COMPONENTS...",
    "> OPTIMIZING DATABASE SCHEMA...",
    "> READY FOR DEPLOYMENT."
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
       setLines(prev => {
         const newLines = [...prev.slice(1), prev[0]];
         return newLines;
       });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 md:py-32 bg-[#08080A] border-y border-white/5 relative overflow-hidden">
       <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5"></div>
       
       <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
             
             <div className="flex-1">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">It thinks like a CTO.</h2>
                <p className="text-base md:text-lg text-text-muted mb-8 leading-relaxed">
                   Watch Inizio reason through complex startup problems in real-time. 
                   From market analysis to code generation, the chain-of-thought engine 
                   ensures nothing is hallucinated.
                </p>
                <div className="flex gap-4">
                   <div className="flex flex-col">
                      <span className="text-3xl md:text-4xl font-bold text-white">2.4s</span>
                      <span className="text-xs font-mono text-text-muted uppercase">Latency</span>
                   </div>
                   <div className="w-[1px] h-12 bg-white/10"></div>
                   <div className="flex flex-col">
                      <span className="text-3xl md:text-4xl font-bold text-primary">100%</span>
                      <span className="text-xs font-mono text-text-muted uppercase">Execution</span>
                   </div>
                </div>
             </div>

             <div className="flex-1 w-full">
                <div className="w-full bg-[#050505] rounded-xl border border-white/10 overflow-hidden shadow-2xl relative">
                   <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/5 to-transparent pointer-events-none"></div>
                   
                   <div className="h-10 bg-[#101012] flex items-center px-4 space-x-2 border-b border-white/5">
                      <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                      <div className="ml-4 text-xs font-mono text-gray-600 flex-1 text-center">inizio_kernel_v2.exe</div>
                   </div>
                   <div className="p-4 md:p-8 font-mono text-sm md:text-base h-64 md:h-80 flex flex-col justify-end relative overflow-hidden">
                      <div className="absolute inset-0 bg-primary/5 animate-pulse pointer-events-none"></div>
                      {lines.map((line, i) => (
                        <motion.div 
                          key={i}
                          layout
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1 - (lines.length - 1 - i) * 0.15, x: 0 }}
                          className="mb-3 text-primary/90 border-l-2 border-primary/20 pl-3 break-all"
                        >
                          {line}
                        </motion.div>
                      ))}
                      <div className="flex items-center mt-2">
                         <span className="text-white mr-2">{">"}</span>
                         <div className="w-3 h-5 bg-white animate-pulse"></div>
                      </div>
                   </div>
                </div>
             </div>

          </div>
       </div>
    </section>
  );
};

const FeatureDeepDive = () => {
  return (
    <section className="py-20 md:py-40 px-6 bg-[#050505] relative overflow-hidden">
       <div className="max-w-7xl mx-auto space-y-24 md:space-y-48">
          <DeepDiveRow 
             step="01"
             title="Truth Scans."
             subtitle="Market Validation"
             desc="Stop guessing. Inizio scouts market signals, analyzes competitors, and runs 'fake door' experiments to validate demand before you write a line of code."
             visual={<RadarVisual />}
          />

          <DeepDiveRow 
             step="02"
             title="Blueprints."
             subtitle="MVP Architecture"
             desc="Get a full manufacturing spec. Feature requirements, tech stack recommendations, and deployment-ready infrastructure designed for scale."
             align="right"
             visual={<BlueprintVisual />}
          />
       </div>
    </section>
  );
};

const DeepDiveRow = ({ step, title, subtitle, desc, align = "left", visual }: any) => (
   <div className={`flex flex-col ${align === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 md:gap-20`}>
      <div className="flex-1">
         <motion.div 
            initial={{ opacity: 0, x: align === 'left' ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
         >
            <div className="flex items-center space-x-4 mb-4 md:mb-6">
               <span className="text-4xl md:text-6xl font-display font-bold text-white/10">{step}</span>
               <span className="text-primary font-mono text-sm uppercase tracking-widest border-l border-primary pl-4 h-10 flex items-center">{subtitle}</span>
            </div>
            <h3 className="text-4xl md:text-7xl font-display font-bold text-white mb-6 md:mb-8 leading-none">{title}</h3>
            <p className="text-lg md:text-xl text-text-muted leading-relaxed mb-8 md:mb-10 font-light">{desc}</p>
            <Button variant="outline" size="lg" className="group text-sm px-8">
                Explore Module <ChevronRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform"/>
            </Button>
         </motion.div>
      </div>
      <div className="flex-1 w-full">
         <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="aspect-square bg-surface/30 rounded-[2rem] md:rounded-[3rem] border border-white/10 relative overflow-hidden flex items-center justify-center shadow-2xl group hover:border-primary/30 transition-colors"
         >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-20"></div>
            {visual}
         </motion.div>
      </div>
   </div>
);

const RadarVisual = () => (
  <div className="relative w-64 h-64 md:w-80 md:h-80">
     <div className="absolute inset-0 border border-white/10 rounded-full"></div>
     <div className="absolute inset-12 border border-white/10 rounded-full"></div>
     <div className="absolute inset-24 border border-white/10 rounded-full"></div>
     <div className="absolute w-full h-[1px] bg-white/10 top-1/2 -translate-y-1/2"></div>
     <div className="absolute h-full w-[1px] bg-white/10 left-1/2 -translate-x-1/2"></div>
     <div className="absolute top-1/2 left-1/2 w-[45%] h-[45%] bg-gradient-to-r from-primary/30 to-transparent origin-top-left animate-[spin_4s_linear_infinite] rounded-tr-full" style={{ transformOrigin: '0 0' }}></div>
     <div className="absolute top-20 right-24 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
     <div className="absolute bottom-24 left-24 w-3 h-3 bg-green-500 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_20px_white]"></div>
  </div>
);

const BlueprintVisual = () => (
   <div className="relative w-full h-full p-8 md:p-12 flex flex-col gap-6 perspective-container transform rotate-x-12">
      <div className="h-12 w-1/2 bg-white/10 rounded-lg animate-pulse"></div>
      <div className="flex-1 grid grid-cols-2 gap-6 transform rotate-x-6">
         <div className="bg-[#151515] border border-white/10 rounded-xl p-6 flex flex-col shadow-xl hover:translate-z-10 transition-transform">
            <div className="w-10 h-10 bg-primary/20 rounded-lg mb-6 flex items-center justify-center"><Cpu size={20} className="text-primary"/></div>
            <div className="h-3 w-full bg-white/10 rounded mb-3"></div>
            <div className="h-3 w-2/3 bg-white/10 rounded"></div>
         </div>
         <div className="bg-[#151515] border border-white/10 rounded-xl p-6 flex flex-col shadow-xl hover:translate-z-10 transition-transform" style={{ marginTop: '2rem' }}>
            <div className="w-10 h-10 bg-secondary/20 rounded-lg mb-6 flex items-center justify-center"><Database size={20} className="text-secondary"/></div>
            <div className="h-3 w-full bg-white/10 rounded mb-3"></div>
            <div className="h-3 w-2/3 bg-white/10 rounded"></div>
         </div>
      </div>
   </div>
);

const PricingSection = () => {
  return (
     <section className="py-20 md:py-40 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
        <div className="max-w-7xl mx-auto relative z-10">
           <div className="text-center mb-16 md:mb-24">
              <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">Invest in Velocity.</h2>
              <p className="text-lg md:text-xl text-text-muted font-light">Cheaper than a co-founder. Faster than an agency.</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <PricingCard title="Explorer" price="0" desc="For the curious." features={['3 Ideas / month', 'Basic Validation', 'Community Support']} delay={0} />
              <PricingCard title="Builder" price="49" desc="For the serious." features={['Unlimited Ideas', 'Full Build Kit', 'Export to Notion/PDF', 'Priority Models', 'Private Mode']} highlight delay={0.1} />
              <PricingCard title="Founder+" price="199" desc="For the scaling." features={['Team Access', 'API Access', 'White-label Reports', '1:1 Strategy Call', 'Custom Models']} delay={0.2} />
           </div>
        </div>
     </section>
  );
};

const PricingCard = ({ title, price, desc, features, highlight, delay }: any) => (
   <motion.div 
     initial={{ opacity: 0, y: 50 }}
     whileInView={{ opacity: 1, y: 0 }}
     viewport={{ once: true }}
     transition={{ delay, duration: 0.6 }}
     className={`p-8 md:p-10 rounded-[2rem] border flex flex-col h-full relative ${highlight ? 'bg-[#101010] border-primary/50 shadow-[0_0_80px_-20px_rgba(46,199,255,0.2)] scale-100 md:scale-105 z-10' : 'bg-black/40 border-white/10 hover:border-white/20'} transition-all`}
   >
      {highlight && <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-black text-[10px] font-bold px-4 py-2 rounded-full uppercase tracking-wider shadow-lg">Most Popular</div>}
      <div className="mb-10">
         <h3 className="text-2xl font-medium text-white mb-2">{title}</h3>
         <p className="text-sm text-text-muted mb-6">{desc}</p>
         <div className="flex items-baseline">
            <span className="text-2xl font-bold text-white/60">$</span>
            <span className="text-6xl md:text-7xl font-display font-bold tracking-tighter text-white">{price}</span>
            <span className="text-text-muted ml-2 text-sm">/mo</span>
         </div>
      </div>
      <ul className="space-y-5 mb-10 flex-1">
         {features.map((f: string, i: number) => (
            <li key={i} className="flex items-center text-sm text-gray-300">
               <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 ${highlight ? 'bg-primary/20 text-primary' : 'bg-white/10 text-gray-500'}`}>
                  <Check size={10} />
               </div>
               {f}
            </li>
         ))}
      </ul>
      <Button variant={highlight ? 'primary' : 'outline'} size="lg" className="w-full">Select Plan</Button>
   </motion.div>
);

const TestimonialLog = () => {
   return (
      <section className="py-20 md:py-32 border-y border-white/5 bg-[#08080A]">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
               <h2 className="text-3xl font-bold text-white">System Logs</h2>
               <p className="text-text-muted text-sm mt-2">User feedback from the beta cohort.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               <Testimonial 
                  quote="INIZIO validated my idea and built the roadmap in 4 minutes. It feels illegal."
                  author="Rahul"
                  role="Indie Hacker"
               />
               <Testimonial 
                  quote="This feels like having a CTO who never sleeps. The tech stack recommendations were spot on."
                  author="Amrita"
                  role="Solo Founder"
               />
            </div>
         </div>
      </section>
   );
};

const Testimonial = ({ quote, author, role }: any) => (
   <motion.div 
      whileHover={{ y: -5 }}
      className="p-8 md:p-10 bg-white/5 rounded-2xl border border-white/5 flex flex-col relative font-mono text-sm group hover:border-primary/20 transition-colors"
   >
      <div className="text-primary/50 mb-6 text-xs uppercase tracking-widest border-b border-white/5 pb-4 flex justify-between">
         <span>{'<USER_FEEDBACK>'}</span>
         <span>Verified</span>
      </div>
      <p className="text-gray-300 mb-8 relative z-10 leading-loose text-base md:text-lg">"{quote}"</p>
      <div className="flex items-center mt-auto">
         <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-black rounded-full mr-4 border border-white/10 flex items-center justify-center text-white font-bold">
            {author[0]}
         </div>
         <div>
            <div className="text-white font-bold text-base">{author}</div>
            <div className="text-text-muted text-xs uppercase">{role}</div>
         </div>
      </div>
   </motion.div>
);

const FinalCTA = ({ onEnter }: { onEnter: () => void }) => {
   return (
      <section className="py-24 md:py-48 px-6 text-center relative overflow-hidden flex items-center justify-center">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 animate-pulse"></div>
         <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent opacity-30 pointer-events-none"></div>
         <div className="relative z-10 max-w-5xl mx-auto">
            <motion.div
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8 }}
            >
                <h2 className="text-5xl md:text-9xl font-display font-bold text-white mb-8 md:mb-12 tracking-tighter">
                Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-white">Build?</span>
                </h2>
                <p className="text-lg md:text-xl text-text-muted mb-12 md:mb-16 max-w-2xl mx-auto font-light">
                    Stop dreaming. Start shipping. Join the next generation of founders building with intelligence.
                </p>
                <Button variant="primary" size="lg" onClick={onEnter} className="px-10 py-6 md:px-16 md:py-8 text-xl md:text-2xl shadow-[0_0_100px_rgba(46,199,255,0.4)] group rounded-full hover:scale-105 transition-transform duration-300">
                Initialize Project <ArrowRight size={28} className="ml-4 group-hover:translate-x-2 transition-transform" />
                </Button>
            </motion.div>
         </div>
      </section>
   );
};

const Footer = () => {
   return (
      <footer className="py-12 md:py-16 px-6 md:px-8 bg-black text-center md:text-left border-t border-white/5 relative z-20">
         <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-text-dim text-xs font-mono uppercase tracking-wider">
            <div className="flex items-center space-x-3">
               <div className="w-3 h-3 bg-white/20 rounded-full"></div>
               <span className="font-bold text-white">INIZIO SYSTEMS © 2025</span>
            </div>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-10">
               <a href="#" className="hover:text-white transition-colors">Manifesto</a>
               <a href="#" className="hover:text-white transition-colors">Privacy Protocol</a>
               <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
            <div className="opacity-50 flex items-center gap-2">
               <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
               System Status: Normal
            </div>
         </div>
      </footer>
   );
};

export default LandingPage;
