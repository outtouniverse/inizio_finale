
import React, { useState, useEffect, useRef } from 'react';
import { IdeaContext, AgentStep, AgentState, ArtifactVersion, FeedbackType, CallPersona } from '../types';
import { runAgent, rethinkNode } from '../services/geminiService';
import { projectService } from '../services/projectService';
import { STEPS_ORDER, MOCK_PERSONAS } from '../constants';
import { ArrowLeft, Search, ChevronLeft, ChevronRight, Maximize2, Sparkles, Zap, Lock, Mic, UserSearch, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Modules
import ValidationModule from './modules/ValidationModule';
import MVPModule from './modules/MVPModule';
import TechStackModule from './modules/TechStackModule';
import GeoModule from './modules/GeoModule';
import DeckModule from './modules/DeckModule';
import RiskModule from './modules/RiskModule';
import ScoreModule from './modules/ScoreModule';
import NamingModule from './modules/NamingModule';
import CompetitorModule from './modules/CompetitorModule';
import RealityModule from './modules/RealityModule';
import RoadmapModule from './modules/RoadmapModule';
import MarketPulseModule from './modules/MarketPulseModule';
import BreakDownModule from './modules/BreakDownModule';
import ExperimentsModule from './modules/ExperimentsModule';
import TimelineModule from './modules/TimelineModule';
import LaunchModule from './modules/LaunchModule';
import CreativeStudioModule from './modules/CreativeStudioModule';
import FounderFitModule from './modules/FounderFitModule';
import CustomerDeepDiveModule from './modules/CustomerDeepDiveModule';

import ModuleContainer from './ModuleContainer';
import FeedbackModal from './FeedbackModal';
import RethinkPreview from './RethinkPreview';
import AudioAgent from './audio/AudioAgent'; // Legacy/Mock
import LiveCallInterface from './audio/LiveCallInterface'; // New Realtime
import UserFinder from './finder/UserFinder';

interface Props {
  idea: IdeaContext;
  projectId: string;
  project: any; // Full project data from backend
  onReset: () => void;
  onProjectUpdate?: (updatedProject: any) => void; // Callback to update parent project data
}

type ViewMode = 'CONSTELLATION' | 'MODULE';

// --- CONSTELLATION CONNECTIONS COMPONENT ---
const ConstellationConnections: React.FC<{ steps: AgentStep[], completedSteps: AgentStep[], activeStep: AgentStep | null }> = ({ steps, completedSteps, activeStep }) => {
  const containerRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [cols, setCols] = useState(4);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
        
        if (width < 640) setCols(1);
        else if (width < 1024) setCols(2);
        else setCols(4);
      }
    };

    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const getCoord = (index: number) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    
    const effectiveCol = row % 2 === 0 ? col : (cols - 1 - col);
    
    const x = (effectiveCol * (dimensions.width / cols)) + (dimensions.width / cols / 2);
    const rowHeight = 180; 
    const y = (row * rowHeight) + (rowHeight / 2);
    
    return { x, y };
  };

  return (
    <svg 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
      style={{ height: Math.ceil(steps.length / cols) * 180 }}
    >
      <defs>
        <linearGradient id="gradient-line" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2EC7FF" stopOpacity="0" />
          <stop offset="50%" stopColor="#2EC7FF" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#2EC7FF" stopOpacity="0" />
        </linearGradient>
        <filter id="glow-line">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {steps.map((step, i) => {
        if (i === steps.length - 1) return null; 
        
        const start = getCoord(i);
        const end = getCoord(i + 1);
        
        const isCompleted = completedSteps.includes(step);
        const isActive = activeStep === step;
        
        const isSameRow = Math.floor(i / cols) === Math.floor((i + 1) / cols);
        
        let d = '';
        if (isSameRow) {
           d = `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
        } else {
           const midY = (start.y + end.y) / 2;
           d = `M ${start.x} ${start.y} C ${start.x} ${midY}, ${end.x} ${midY}, ${end.x} ${end.y}`;
        }

        return (
          <g key={`conn-${i}`}>
            <path 
              d={d} 
              stroke="rgba(255,255,255,0.05)" 
              strokeWidth="1" 
              fill="none" 
            />
            {(isCompleted || isActive) && (
              <>
                <path 
                  d={d} 
                  stroke="url(#gradient-line)" 
                  strokeWidth="2" 
                  fill="none"
                  filter="url(#glow-line)"
                  strokeDasharray="5,5"
                  className="opacity-50"
                />
                <circle r="2" fill="#fff">
                  <animateMotion 
                    dur={`${2 + (i % 3)}s`} 
                    repeatCount="indefinite" 
                    path={d} 
                    keyPoints="0;1"
                    keyTimes="0;1"
                    calcMode="linear"
                  />
                </circle>
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
};

const AgentWorkspace: React.FC<Props> = ({ idea, projectId, project: initialProject, onReset, onProjectUpdate }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('CONSTELLATION');
  const [activeStep, setActiveStep] = useState<AgentStep | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showAudioAgent, setShowAudioAgent] = useState(false); // Legacy select screen
  const [activeLivePersona, setActiveLivePersona] = useState<CallPersona | null>(null); // Realtime
  const [showUserFinder, setShowUserFinder] = useState(false);
  const [currentProject, setCurrentProject] = useState(initialProject); // Track current project data
  const [projectLoading, setProjectLoading] = useState(false); // Loading state for project data

  const [state, setState] = useState<AgentState>({
    currentStep: 'PULSE',
    history: [],
    idea,
    isThinking: false,
    versions: {}
  });

  // Function to refresh project data from backend
  const refreshProjectData = async () => {
    setProjectLoading(true);
    try {
      const updatedProject = await projectService.getProject(projectId);
      setCurrentProject(updatedProject);
      // Notify parent component of the update
      if (onProjectUpdate) {
        onProjectUpdate(updatedProject);
      }
      return updatedProject;
    } catch (error) {
      console.error('Failed to refresh project data:', error);
      return currentProject;
    } finally {
      setProjectLoading(false);
    }
  };

  // Load initial project data on mount
  useEffect(() => {
    refreshProjectData();
  }, [projectId]);

  // --- Auto-Agent Orchestration ---
  useEffect(() => {
    let mounted = true;

    const processAllSteps = async () => {
      await new Promise(r => setTimeout(r, 1000)); 
      
      for (const step of STEPS_ORDER) {
        if (!mounted) break;
        
        if (state.history.includes(step)) continue;

        const storedArtifact = currentProject?.metadata?.[step];

        if (storedArtifact) {
          setState(prev => {
            const newState: any = { ...prev, history: [...prev.history, step] };
            const key = step.toLowerCase();
            if (step === 'RISK') newState.risks = storedArtifact;
            else if (step === 'FOUNDER_FIT') newState.founder_fit = storedArtifact;
            else newState[key] = storedArtifact;
            
            const ver = prev.versions[step] || [];
            if (ver.length === 0) {
               newState.versions = {
                   ...prev.versions,
                   [step]: [{
                       id: Date.now().toString(),
                       timestamp: Date.now(),
                       step,
                       data: storedArtifact,
                   }]
               };
            }
            return newState;
          });
          continue; 
        }
        
        setState(prev => ({ ...prev, isThinking: true, currentStep: step }));
        try {
          const result = await runAgent(step, idea);
          
          if (mounted && result) {
            try {
              await projectService.saveProjectArtifact(projectId, step, result);
              // Refresh project data to get the latest metadata
              await refreshProjectData();
            } catch (error) {
              console.warn('Failed to save artifact to backend:', error);
            }
            setState(prev => {
              const newState: any = { ...prev, isThinking: false, history: [...prev.history, step] };
              const key = step.toLowerCase();
              if (step === 'RISK') newState.risks = result;
              else if (step === 'FOUNDER_FIT') newState.founder_fit = result;
              else newState[key] = result;
              
              newState.versions = {
                 ...prev.versions,
                 [step]: [{
                     id: Date.now().toString(),
                     timestamp: Date.now(),
                     step,
                     data: result,
                 }]
              };
              return newState;
            });
          }
        } catch (e: any) {
          console.error(`Failed step ${step}`, e);
          if (mounted) setState(prev => ({ ...prev, isThinking: false }));
          if (e.message === "QUOTA_EXCEEDED") break;
        }
      }
    };
    
    processAllSteps();
    
    return () => { mounted = false; };
  }, [idea, projectId]); 

  // --- RETHINK LOGIC ---
  const handleFeedbackSubmit = async (type: FeedbackType, text: string, constraints: string) => {
    if (!activeStep) return;
    setShowFeedbackModal(false);
    setState(prev => ({ ...prev, isThinking: true }));
    
    let key = activeStep.toLowerCase();
    if (activeStep === 'RISK') key = 'risks';
    if (activeStep === 'FOUNDER_FIT') key = 'founder_fit';
    
    const currentData = (state as any)[key];
    
    try {
        const response = await rethinkNode(activeStep, currentData, idea, text, constraints);
        setState(prev => ({
            ...prev,
            isThinking: false,
            pendingRethink: {
                step: activeStep,
                variant: response.data,
                rationale: response.rationale,
                changes: response.changes,
                feedback: {
                    id: Date.now().toString(),
                    type,
                    text,
                    timestamp: Date.now()
                }
            }
        }));
    } catch (e) {
        console.error("Rethink Error", e);
        setState(prev => ({ ...prev, isThinking: false }));
    }
  };

  const handleAcceptRethink = async () => {
    if (!state.pendingRethink) return;
    const { step, variant, feedback, rationale, changes } = state.pendingRethink;
    try {
      await projectService.saveProjectArtifact(projectId, step, variant);
      // Refresh project data to get the latest metadata
      await refreshProjectData();
    } catch (error) {
      console.warn('Failed to save artifact to backend:', error);
    }
    
    setState(prev => {
        const newState: any = { ...prev, pendingRethink: undefined };
        let key = step.toLowerCase();
        if (step === 'RISK') key = 'risks';
        if (step === 'FOUNDER_FIT') key = 'founder_fit';
        newState[key] = variant;

        const newVersion: ArtifactVersion = {
            id: Date.now().toString(),
            timestamp: Date.now(),
            step,
            data: variant,
            feedback,
            rationale,
            changes
        };
        
        newState.versions = {
            ...prev.versions,
            [step]: [...(prev.versions[step] || []), newVersion]
        };
        return newState;
    });
  };

  const handleRejectRethink = () => setState(prev => ({ ...prev, pendingRethink: undefined }));

  const handleRestoreVersion = async (version: ArtifactVersion) => {
      const step = version.step;
      try {
        await projectService.saveProjectArtifact(projectId, step, version.data);
        // Refresh project data to get the latest metadata
        await refreshProjectData();
      } catch (error) {
        console.warn('Failed to save artifact to backend:', error);
      }
      setState(prev => {
          const newState: any = { ...prev };
          let key = step.toLowerCase();
          if (step === 'RISK') key = 'risks';
          if (step === 'FOUNDER_FIT') key = 'founder_fit';
          newState[key] = version.data;
          return newState;
      });
  };

  const handleNodeClick = (step: AgentStep) => {
    if (!state.history.includes(step) && state.currentStep !== step) return; 
    setActiveStep(step);
    setViewMode('MODULE');
  };

  const handleReturnToMap = () => {
    setViewMode('CONSTELLATION');
    setTimeout(() => setActiveStep(null), 500);
  };

  const currentStepIndex = activeStep ? STEPS_ORDER.indexOf(activeStep) : 0;

  // --- Module Rendering ---
  const renderModuleWrapper = () => {
    if (!activeStep) return null;
    const anyState = state as any;
    let content = null;

    switch (activeStep) {
      case 'PULSE': content = anyState.pulse ? <MarketPulseModule data={anyState.pulse} /> : null; break;
      case 'VALIDATION': content = anyState.validation ? <ValidationModule data={anyState.validation} /> : null; break;
      case 'FOUNDER_FIT': content = anyState.founder_fit ? <FounderFitModule data={anyState.founder_fit} /> : null; break;
      case 'CUSTOMER': content = anyState.customer ? <CustomerDeepDiveModule data={anyState.customer} /> : null; break;
      case 'BREAKDOWN': content = anyState.breakdown ? <BreakDownModule data={anyState.breakdown} /> : null; break;
      case 'EXPERIMENTS': content = anyState.experiments ? <ExperimentsModule data={anyState.experiments} /> : null; break;
      case 'NAMING': content = anyState.naming ? <NamingModule data={anyState.naming} /> : null; break;
      case 'COMPETITORS': content = anyState.competitors ? <CompetitorModule data={anyState.competitors} /> : null; break;
      case 'REALITY': content = anyState.reality ? <RealityModule data={anyState.reality} /> : null; break;
      case 'ROADMAP': content = anyState.roadmap ? <RoadmapModule data={anyState.roadmap} /> : null; break;
      case 'TIMELINE': content = anyState.timeline ? <TimelineModule data={anyState.timeline} /> : null; break;
      case 'MVP': content = anyState.mvp ? <MVPModule data={anyState.mvp} /> : null; break;
      case 'STACK': content = anyState.stack ? <TechStackModule data={anyState.stack} /> : null; break;
      case 'GEO': content = anyState.geo ? <GeoModule data={anyState.geo} /> : null; break;
      case 'LAUNCH': content = anyState.launch ? <LaunchModule data={anyState.launch} /> : null; break;
      case 'DECK': content = anyState.deck ? <DeckModule data={anyState.deck} /> : null; break;
      case 'RISK': content = anyState.risks ? <RiskModule data={anyState.risks} /> : null; break;
      case 'CREATIVE': content = anyState.creative ? <CreativeStudioModule data={anyState.creative} /> : null; break;
      case 'SCORE': content = anyState.score ? <ScoreModule data={anyState.score} /> : null; break;
    }

    if (!state.history.includes(activeStep) && !content) {
       return (
         <div className="h-full flex flex-col items-center justify-center animate-pulse">
            <div className="w-16 h-16 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-primary font-mono text-sm">NEURAL NET PROCESSING: {activeStep}...</p>
         </div>
       );
    }

    return (
        <ModuleContainer 
            step={activeStep} 
            versions={state.versions[activeStep] || []}
            onFeedback={() => setShowFeedbackModal(true)}
            onRestore={handleRestoreVersion}
        >
            {content}
        </ModuleContainer>
    );
  };

  return (
    <div className="relative mt-20 w-full h-[100dvh] z-10 bg-[#030304] overflow-hidden flex flex-col selection:bg-primary/30">
      
      {/* --- MODALS & OVERLAYS --- */}
      {showFeedbackModal && (
         <FeedbackModal 
            onClose={() => setShowFeedbackModal(false)} 
            onSubmit={handleFeedbackSubmit} 
         />
      )}

      {state.pendingRethink && activeStep && (
         <RethinkPreview 
            original={(state as any)[
              activeStep === 'RISK' ? 'risks' : 
              activeStep === 'FOUNDER_FIT' ? 'founder_fit' : 
              activeStep.toLowerCase()
            ]}
            variant={state.pendingRethink.variant}
            rationale={state.pendingRethink.rationale}
            changes={state.pendingRethink.changes}
            onAccept={handleAcceptRethink}
            onReject={handleRejectRethink}
         />
      )}

      {showAudioAgent && (
         <AudioAgent onClose={() => setShowAudioAgent(false)} />
      )}
      
      {activeLivePersona && (
         <LiveCallInterface 
            persona={activeLivePersona} 
            context={idea.description} 
            onEnd={() => setActiveLivePersona(null)} 
         />
      )}

      {showUserFinder && <UserFinder onClose={() => setShowUserFinder(false)} />}

      {/* --- CONSTELLATION MAP VIEW --- */}
      <motion.div 
        className="absolute inset-0 z-10 flex flex-col overflow-hidden"
        initial={{ opacity: 1, scale: 1 }}
        animate={{ 
          opacity: viewMode === 'CONSTELLATION' ? 1 : 0,
          scale: viewMode === 'CONSTELLATION' ? 1 : 1.2,
          filter: viewMode === 'CONSTELLATION' ? 'blur(0px)' : 'blur(12px)',
          pointerEvents: viewMode === 'CONSTELLATION' ? 'auto' : 'none'
        }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        {/* Header */}
        <div className="flex-none px-6 md:px-12 py-8 z-20 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gradient-to-b from-black via-black/80 to-transparent">
          <div>
             <button onClick={onReset} className="text-[10px] font-mono text-text-muted hover:text-white flex items-center mb-2 transition-colors tracking-widest">
               <ArrowLeft size={10} className="mr-1" /> RETURN TO VAULT
             </button>
             <h1 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight flex items-center">
                {idea.industry} <span className="text-white/30 mx-2">/</span> Constellation
             </h1>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
             <div className="relative flex-1 md:w-64 group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary transition-colors" size={14} />
               <input 
                 type="text" 
                 placeholder="Search sector..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-9 pr-4 text-sm text-white focus:border-primary/50 focus:bg-white/10 outline-none transition-all placeholder:text-white/20 font-mono"
               />
             </div>
             
             {/* New Features Buttons */}
             <button 
               onClick={() => setShowUserFinder(true)}
               className="p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-text-muted hover:text-white transition-colors tooltip-trigger"
               title="Find Users"
             >
                <Globe size={20} />
             </button>
             
             <button 
               onClick={() => setActiveLivePersona(MOCK_PERSONAS[0])} // Default to first persona for now, real app would show selector
               className="p-3 rounded-full bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary transition-colors tooltip-trigger shadow-[0_0_10px_rgba(46,199,255,0.2)] animate-pulse-glow"
               title="Live Call Customer"
             >
                <Mic size={20} />
             </button>
          </div>
        </div>

        {/* Scrollable Map Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative p-4 md:p-12">
           
           <div className="fixed inset-0 pointer-events-none z-0">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 animate-pulse-slow"></div>
              <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] mix-blend-screen"></div>
              <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[150px] mix-blend-screen"></div>
           </div>

           <div className="relative z-10 max-w-7xl mx-auto">
             
             <ConstellationConnections 
                steps={STEPS_ORDER} 
                completedSteps={state.history} 
                activeStep={state.currentStep} 
             />

             <motion.div 
               className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-12 relative z-20"
               layout
             >
               {STEPS_ORDER.map((step, index) => {
                 const isReady = state.history.includes(step);
                 const isThinking = state.currentStep === step && state.isThinking;
                 const isDimmed = searchQuery && !step.toLowerCase().includes(searchQuery.toLowerCase());

                 return (
                   <StarNode 
                     key={step}
                     step={step}
                     index={index}
                     status={isThinking ? 'THINKING' : isReady ? 'READY' : 'LOCKED'}
                     isDimmed={!!isDimmed}
                     onClick={() => handleNodeClick(step)}
                   />
                 );
               })}
             </motion.div>
           </div>

        </div>
      </motion.div>

      {/* --- MODULE VIEW --- */}
      <motion.div 
        className="absolute inset-0 z-30 flex flex-col bg-[#030304]"
        initial={{ opacity: 0, y: '100%' }}
        animate={{ 
          opacity: viewMode === 'MODULE' ? 1 : 0,
          y: viewMode === 'MODULE' ? '0%' : '100%',
          pointerEvents: viewMode === 'MODULE' ? 'auto' : 'none'
        }}
        transition={{ type: "spring", stiffness: 250, damping: 30 }}
      >
         {/* Module Header */}
         <div className="flex-none h-16 md:h-20 px-6 md:px-12 flex items-center justify-between border-b border-white/5 bg-black/80 backdrop-blur-md z-40 mt-16 md:mt-0">
            <div className="flex-1 flex justify-start">
              <button 
                onClick={handleReturnToMap}
                className="flex items-center space-x-3 text-text-muted hover:text-white transition-colors group interactive"
              >
                <div className="p-2 rounded-full border border-white/10 group-hover:bg-white/10 transition-colors">
                   <ArrowLeft size={16} />
                </div>
                <span className="text-xs font-mono tracking-widest uppercase hidden md:inline">Back to Map</span>
              </button>
            </div>

            <div className="flex-none flex flex-col items-center">
              <div className="flex items-center space-x-3">
                <span className="text-lg md:text-xl font-display font-bold text-white tracking-tight">
                    {activeStep?.replace(/_/g, ' ')}
                </span>
                <div className="flex space-x-1">
                   {[1,2,3].map(i => <div key={i} className={`w-1 h-1 rounded-full ${i===0 ? 'bg-primary animate-pulse' : 'bg-white/20'}`}></div>)}
                </div>
              </div>
            </div>

            <div className="flex-1 flex justify-end items-center gap-3">
               <button 
                 onClick={() => {
                    const prev = STEPS_ORDER[currentStepIndex - 1];
                    if (prev) handleNodeClick(prev);
                 }}
                 disabled={currentStepIndex === 0}
                 className="p-2 rounded-full hover:bg-white/5 text-text-muted hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
               >
                  <ChevronLeft size={18} />
               </button>
               
               <span className="text-xs font-mono text-text-muted">
                  <span className="text-white font-bold">{currentStepIndex + 1}</span>
                  <span className="opacity-50 mx-1">/</span>
                  {STEPS_ORDER.length}
               </span>

               <button 
                 onClick={() => {
                    const next = STEPS_ORDER[currentStepIndex + 1];
                    if (next) handleNodeClick(next);
                 }}
                 disabled={currentStepIndex === STEPS_ORDER.length - 1}
                 className="p-2 rounded-full hover:bg-white/5 text-text-muted hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
               >
                  <ChevronRight size={18} />
               </button>
            </div>
         </div>

         {/* Module Content */}
         <div className="flex-1 overflow-hidden relative bg-black/20">
            <div className="h-full w-full">
               {viewMode === 'MODULE' && renderModuleWrapper()}
            </div>
         </div>
      </motion.div>
    </div>
  );
};

// --- VISUAL COMPONENTS ---

const StarNode = ({ step, index, status, isDimmed, onClick }: any) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: isDimmed ? 0.2 : 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className={`
        relative group w-full aspect-[4/3] md:aspect-[16/10] flex flex-col items-center justify-center p-6
        transition-all duration-500
        ${status === 'LOCKED' ? 'cursor-not-allowed grayscale opacity-60' : 'cursor-pointer hover:scale-105'}
      `}
    >
       <div className={`absolute inset-0 rounded-2xl border backdrop-blur-sm transition-all duration-500
          ${status === 'READY' 
             ? 'bg-white/[0.02] border-white/10 shadow-[0_0_30px_rgba(46,199,255,0.05)] group-hover:border-primary/40 group-hover:shadow-[0_0_50px_rgba(46,199,255,0.2)]' 
             : status === 'THINKING'
             ? 'bg-primary/5 border-primary/50 shadow-[0_0_40px_rgba(46,199,255,0.15)] animate-pulse'
             : 'bg-transparent border-white/5'
          }
       `}>
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 rounded-tl-lg"></div>
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20 rounded-tr-lg"></div>
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20 rounded-bl-lg"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20 rounded-br-lg"></div>
       </div>

       <div className="relative mb-4">
          {status === 'READY' && (
             <div className="relative w-12 h-12 flex items-center justify-center">
                <div className="absolute inset-0 bg-primary rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="w-3 h-3 bg-white rounded-full shadow-[0_0_15px_white] z-10"></div>
                <div className="absolute inset-0 border border-primary/30 rounded-full animate-spin-slow-reverse"></div>
                <div className="absolute -inset-2 border border-dashed border-white/10 rounded-full animate-spin-slow"></div>
             </div>
          )}
          
          {status === 'THINKING' && (
             <div className="relative w-12 h-12 flex items-center justify-center">
                <Zap size={24} className="text-primary animate-bounce" />
                <div className="absolute inset-0 border-t-2 border-primary rounded-full animate-spin"></div>
             </div>
          )}

          {status === 'LOCKED' && (
             <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                <Lock size={16} className="text-white/20" />
             </div>
          )}
       </div>

       <div className="text-center z-10">
          <h3 className={`text-sm md:text-base font-bold font-display tracking-wide mb-1 ${status === 'READY' ? 'text-white group-hover:text-primary transition-colors' : 'text-white/40'}`}>
            {step.replace(/_/g, ' ')}
          </h3>
          <div className="flex items-center justify-center gap-2">
             <span className={`text-[9px] font-mono uppercase tracking-widest ${status === 'READY' ? 'text-primary' : 'text-white/20'}`}>
                {status === 'THINKING' ? 'GENERATING...' : status === 'READY' ? 'COMPLETE' : 'LOCKED'}
             </span>
          </div>
       </div>

       {status === 'READY' && (
          <div className="absolute inset-0 overflow-hidden rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent transform rotate-45"></div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent transform -rotate-45"></div>
          </div>
       )}
    </motion.div>
  );
};

export default AgentWorkspace;
