
import React, { useState, useEffect } from 'react';
import { ArrowRight, X, Sparkles, Target, Layers, MessageSquare } from 'lucide-react';
import Button from './ui/Button';
import { IdeaContext, FounderStage, IndustryType } from '../types';

interface EntryScreenProps {
  onStart: (context: IdeaContext) => void;
  onCancel?: () => void;
}

type OnboardingPhase = 'CAPTURE' | 'STAGE' | 'DEEP_DIVE';

const EntryScreen: React.FC<EntryScreenProps> = ({ onStart, onCancel }) => {
  const [phase, setPhase] = useState<OnboardingPhase>('CAPTURE');
  
  // Data
  const [rawInput, setRawInput] = useState('');
  const [stage, setStage] = useState<FounderStage>('IDEA_FOG');
  const [deepDiveAnswers, setDeepDiveAnswers] = useState({
    goal: '',
    constraints: ''
  });

  // Phase 1: Detection
  const detectIndustry = (input: string): IndustryType => {
    const low = input.toLowerCase();
    if (low.includes('clothing') || low.includes('brand') || low.includes('wear')) return 'Fashion';
    if (low.includes('food') || low.includes('cafe') || low.includes('drink')) return 'Food';
    if (low.includes('channel') || low.includes('content') || low.includes('video')) return 'Creator';
    if (low.includes('app') || low.includes('saas') || low.includes('platform') || low.includes('ai')) return 'Tech';
    if (low.includes('shop') || low.includes('store')) return 'Service';
    return 'Other';
  };

  const handleCapture = () => {
    if (!rawInput.trim()) return;
    setPhase('STAGE');
  };

  const handleStageSelect = (s: FounderStage) => {
    setStage(s);
    setPhase('DEEP_DIVE');
  };

  const handleFinalLaunch = () => {
    const industry = detectIndustry(rawInput);
    onStart({
      rawInput,
      description: rawInput, 
      industry,
      stage,
      userGoal: deepDiveAnswers.goal,
      constraints: deepDiveAnswers.constraints
    });
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden animate-fade-in min-h-[100dvh] w-full">
      
      {onCancel && (
        <button onClick={onCancel} className="absolute top-6 right-6 text-text-muted hover:text-text-main interactive z-50 p-2">
          <X size={24} />
        </button>
      )}

      {/* Dynamic Background based on phase */}
      <div className={`absolute inset-0 transition-colors duration-1000 pointer-events-none opacity-20 
        ${phase === 'CAPTURE' ? 'bg-gradient-to-br from-primary/5 to-transparent' : ''}
        ${phase === 'STAGE' ? 'bg-gradient-to-br from-secondary/5 to-transparent' : ''}
        ${phase === 'DEEP_DIVE' ? 'bg-gradient-to-br from-accent/5 to-transparent' : ''}
      `} />
      
      <div className="relative z-10 w-full max-w-4xl px-4 md:px-12 py-12 flex flex-col justify-center h-full">
        
        {/* PHASE 1: CAPTURE */}
        {phase === 'CAPTURE' && (
          <div className="space-y-8 md:space-y-12 animate-slide-up w-full">
            <div className="space-y-4">
              <div className="text-xs font-mono text-primary/80 tracking-[0.2em] uppercase animate-pulse">Inizio // Cortex</div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-light text-text-main tracking-tight leading-tight">
                Tell me the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-text-main">dream.</span>
              </h1>
              <p className="text-text-muted text-lg md:text-xl font-light max-w-2xl">I handle tech, fashion, food, content, anything.</p>
            </div>

            <div className="relative group w-full">
              <input 
                type="text" 
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCapture()}
                placeholder="e.g. A streetwear brand for coders..." 
                className="w-full bg-transparent border-b border-white/20 py-4 text-xl md:text-3xl lg:text-4xl text-text-main placeholder-text-muted/20 focus:outline-none focus:border-primary/80 transition-all font-light"
                autoFocus
              />
            </div>

            <div className={`transition-opacity duration-500 ${rawInput ? 'opacity-100' : 'opacity-0'} pt-4`}>
              <Button variant="glass" size="lg" onClick={handleCapture} className="group w-full md:w-auto text-base py-4">
                <span className="mr-2">Next: Context</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        )}

        {/* PHASE 2: STAGE */}
        {phase === 'STAGE' && (
          <div className="animate-slide-up w-full max-w-3xl mx-auto">
             <h2 className="text-2xl md:text-4xl text-text-main font-display mb-8 md:mb-12 leading-tight">Where are we standing right now?</h2>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <StageCard 
                   icon={Sparkles} 
                   title="Just a Spark" 
                   desc="I have a rough concept. Need clarity and validation." 
                   onClick={() => handleStageSelect('IDEA_FOG')} 
                />
                <StageCard 
                   icon={Target} 
                   title="Validation Mode" 
                   desc="I have the idea, I need to know if it will work." 
                   onClick={() => handleStageSelect('VALIDATION')} 
                />
                <StageCard 
                   icon={MessageSquare} 
                   title="Needs Identity" 
                   desc="The product is clear, but the name/brand is missing." 
                   onClick={() => handleStageSelect('NAMING')} 
                />
                <StageCard 
                   icon={Layers} 
                   title="Ready to Build" 
                   desc="I need a roadmap, specs, and execution plan." 
                   onClick={() => handleStageSelect('BUILDING')} 
                />
             </div>
             
             <div className="mt-8 flex justify-start">
                <button onClick={() => setPhase('CAPTURE')} className="text-xs text-text-muted hover:text-text-main uppercase tracking-wider p-2">Back</button>
             </div>
          </div>
        )}

        {/* PHASE 3: DEEP DIVE */}
        {phase === 'DEEP_DIVE' && (
           <div className="animate-slide-up w-full max-w-2xl mx-auto">
              <div className="flex items-center space-x-3 mb-8">
                 <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                 </div>
                 <span className="text-primary font-mono text-xs uppercase tracking-widest">Co-Founder Sync</span>
              </div>

              <div className="space-y-8">
                 <div className="space-y-3">
                    <label className="text-lg md:text-2xl text-text-main font-light block">What is the ultimate win here?</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 10k users, quitting my job, or just fun..."
                      value={deepDiveAnswers.goal}
                      onChange={(e) => setDeepDiveAnswers({...deepDiveAnswers, goal: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-text-main focus:border-primary/50 focus:bg-white/10 outline-none transition-all text-base md:text-lg"
                      autoFocus
                    />
                 </div>
                 
                 <div className="space-y-3">
                    <label className="text-lg md:text-2xl text-text-main font-light block">Any constraints I should know?</label>
                    <input 
                      type="text" 
                      placeholder="e.g. $0 budget, I can't code, I only have weekends..."
                      value={deepDiveAnswers.constraints}
                      onChange={(e) => setDeepDiveAnswers({...deepDiveAnswers, constraints: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-text-main focus:border-primary/50 focus:bg-white/10 outline-none transition-all text-base md:text-lg"
                    />
                 </div>

                 <div className="pt-8 flex flex-col-reverse md:flex-row items-center justify-between gap-4">
                    <button onClick={() => setPhase('STAGE')} className="text-xs text-text-muted hover:text-text-main uppercase tracking-wider p-2">Back</button>
                    <Button variant="primary" size="lg" onClick={handleFinalLaunch} disabled={!deepDiveAnswers.goal} className="w-full md:w-auto py-4">
                       Initialize System
                    </Button>
                 </div>
              </div>
           </div>
        )}

      </div>
    </div>
  );
};

const StageCard = ({ icon: Icon, title, desc, onClick }: any) => (
  <button 
    onClick={onClick}
    className="text-left p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/30 transition-all group w-full"
  >
    <div className="flex items-center justify-between mb-3">
       <Icon className="text-text-muted group-hover:text-primary transition-colors" size={24} />
       <ArrowRight className="text-transparent group-hover:text-text-main transition-colors -translate-x-2 group-hover:translate-x-0" size={16} />
    </div>
    <h3 className="text-lg font-bold text-text-main mb-1">{title}</h3>
    <p className="text-sm text-text-muted leading-relaxed">{desc}</p>
  </button>
);

export default EntryScreen;
