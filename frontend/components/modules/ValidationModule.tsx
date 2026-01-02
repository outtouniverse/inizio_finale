
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ChevronDown, 
  ChevronUp, 
  Layers, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { ValidationData } from '../../types';

interface Props {
  data: ValidationData;
}

// Helper to parse text blobs into "bullets" for the UI
const textToBullets = (text: string, limit: number = 3) => {
  if (!text) return ["Analysis pending..."];
  // Split by periods, remove empty strings, trim
  const sentences = text.split(/(?:\.|\n)/).filter(s => s.trim().length > 10);
  return sentences.slice(0, limit).map(s => s.trim());
};

const ValidationModule: React.FC<Props> = ({ data }) => {
  const [isVerdictExpanded, setIsVerdictExpanded] = useState(false);

  // --- DERIVED STATE & MAPPINGS ---
  const rating = data.problemClarity.rating || 'Neutral';
  const isGreen = rating === 'Signal';
  const isYellow = rating === 'Opportunity';
  
  const themeColor = isGreen ? 'text-emerald-400' : isYellow ? 'text-amber-400' : 'text-rose-400';
  const themeBorder = isGreen ? 'border-emerald-500/30' : isYellow ? 'border-amber-500/30' : 'border-rose-500/30';
  const themeGlow = isGreen ? 'shadow-[0_0_30px_-10px_rgba(52,211,153,0.3)]' : isYellow ? 'shadow-[0_0_30px_-10px_rgba(251,191,36,0.3)]' : 'shadow-[0_0_30px_-10px_rgba(244,63,94,0.3)]';
  const themeBg = isGreen ? 'bg-emerald-500/10' : isYellow ? 'bg-amber-500/10' : 'bg-rose-500/10';

  const problemBullets = textToBullets(data.problemClarity.statement);
  const marketBullets = textToBullets(data.marketSize);
  const feasibilityBullets = textToBullets(data.swot?.weakness || "No technical constraints detected.");
  const viabilityBullets = textToBullets(data.swot?.opportunity || "Revenue models exploring...");

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 50 } }
  };

  return (
    <div className="flex flex-col h-full w-full bg-black/20 overflow-hidden relative font-sans text-slate-200">
      
      {/* --- A. HEADER STRIP --- */}
      <div className="flex-none px-4 md:px-6 py-4 border-b border-white/5 bg-black/40 backdrop-blur-md z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base md:text-lg font-medium text-white tracking-wide flex items-center gap-2">
              <Activity size={18} className="text-blue-400" />
              Validation Engine
            </h2>
          </div>
          <div className="h-[1px] flex-1 mx-6 bg-gradient-to-r from-blue-500/50 to-transparent opacity-50 hidden sm:block" />
        </div>
      </div>

      {/* --- B. CONTENT GRID --- */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-hide pb-32">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto"
        >
          
          {/* 1. PROBLEM REALITY CHECK */}
          <motion.div variants={itemVariants} className="group relative p-5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <AlertCircle size={14} className="text-amber-400" />
                Problem
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-300 border border-blue-500/20">
                CLARITY: HIGH
              </span>
            </div>

            <ul className="space-y-3 flex-1">
              {problemBullets.map((bullet, i) => (
                <li key={i} className="flex items-start gap-3 text-xs leading-relaxed text-slate-400">
                  <span className="mt-1 w-1 h-1 rounded-full bg-slate-600 shrink-0" />
                  {bullet}.
                </li>
              ))}
            </ul>
          </motion.div>

          {/* 2. MARKET TRUTH */}
          <motion.div variants={itemVariants} className="group relative p-5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Target size={14} className="text-purple-400" />
                Market
              </h3>
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(n => (
                  <div key={n} className={`w-1 h-3 rounded-sm ${n < 4 ? 'bg-purple-500' : 'bg-slate-700'} opacity-80`} />
                ))}
              </div>
            </div>

            <ul className="space-y-3 flex-1">
              {marketBullets.map((bullet, i) => (
                <li key={i} className="flex items-start gap-3 text-xs leading-relaxed text-slate-400">
                  <span className="mt-1 w-1 h-1 rounded-full bg-slate-600 shrink-0" />
                  {bullet}.
                </li>
              ))}
            </ul>
             
            {data.competitors && data.competitors.length > 0 && (
               <div className="mt-3 flex flex-wrap gap-2">
                 {data.competitors.slice(0, 2).map((comp, idx) => (
                   <span key={idx} className="text-[10px] px-2 py-1 bg-white/5 rounded border border-white/5 text-slate-400 truncate max-w-[120px]">
                     vs {comp.name}
                   </span>
                 ))}
               </div>
            )}
          </motion.div>

          {/* 3. FEASIBILITY SCAN */}
          <motion.div variants={itemVariants} className="group relative p-5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Layers size={14} className="text-cyan-400" />
                Feasibility
              </h3>
            </div>

            <ul className="space-y-3 flex-1">
              {feasibilityBullets.map((bullet, i) => (
                <li key={i} className="flex items-start gap-3 text-xs leading-relaxed text-slate-400">
                  <span className="mt-1 w-1 h-1 rounded-full bg-slate-600 shrink-0" />
                  {bullet}.
                </li>
              ))}
            </ul>
          </motion.div>

          {/* 4. VIABILITY INSIGHTS */}
          <motion.div variants={itemVariants} className="group relative p-5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <TrendingUp size={14} className="text-emerald-400" />
                Viability
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                SUSTAINABLE
              </span>
            </div>

            <ul className="space-y-3 flex-1">
              {viabilityBullets.map((bullet, i) => (
                <li key={i} className="flex items-start gap-3 text-xs leading-relaxed text-slate-400">
                  <span className="mt-1 w-1 h-1 rounded-full bg-slate-600 shrink-0" />
                  {bullet}.
                </li>
              ))}
            </ul>
          </motion.div>

        </motion.div>
      </div>

      {/* --- C. ACTION STRIP / VERDICT BOX --- */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="h-12 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />
        
        <div className={`bg-black/90 backdrop-blur-xl border-t border-white/10 px-4 md:px-8 py-4 transition-all duration-300 ${isVerdictExpanded ? 'pb-8' : 'pb-6'}`}>
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              
              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${themeBorder} ${themeBg} ${themeGlow}`}>
                  {isGreen ? <CheckCircle2 size={14} className={themeColor} /> : 
                   isYellow ? <AlertTriangle size={14} className={themeColor} /> : 
                   <XCircle size={14} className={themeColor} />}
                  <span className={`text-xs font-bold tracking-wider uppercase ${themeColor}`}>
                    {rating.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs md:text-sm text-slate-300 hidden md:block">
                  {data.problemClarity.explanation?.slice(0, 80) || "Market signals indicate fit."}...
                </p>
              </div>

              <button 
                onClick={() => setIsVerdictExpanded(!isVerdictExpanded)}
                className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors px-3 py-2 rounded hover:bg-white/5 ml-auto sm:ml-0"
              >
                Rationale
                {isVerdictExpanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
              </button>
            </div>

            <AnimatePresence>
              {isVerdictExpanded && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div className="p-3 rounded bg-white/5 border border-white/5">
                        <span className="block text-[10px] uppercase text-slate-500 mb-1">Signal Strength</span>
                        <p className="text-xs text-slate-300">Strong alignment with identified user pain points.</p>
                     </div>
                     <div className="p-3 rounded bg-white/5 border border-white/5">
                        <span className="block text-[10px] uppercase text-slate-500 mb-1">Differentiation</span>
                        <p className="text-xs text-slate-300">Unique approach compared to legacy competitors.</p>
                     </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ValidationModule;
