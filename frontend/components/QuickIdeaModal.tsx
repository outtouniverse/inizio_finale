import React, { useState, useEffect } from 'react';
import { X, Sparkles, ArrowRight, Film } from 'lucide-react';
import Button from './ui/Button';
import { generateValidationPlan } from '../services/geminiService';
import { Project } from '../types';

interface QuickIdeaModalProps {
  onClose: () => void;
  onCreated: (project: Project) => void;
}

const QuickIdeaModal: React.FC<QuickIdeaModalProps> = ({ onClose, onCreated }) => {
  const [step, setStep] = useState<'INPUT' | 'GENERATING'>('INPUT');
  const [formData, setFormData] = useState({
    idea: '',
    target: '',
    metric: 'Sign-ups'
  });
  const [loadingText, setLoadingText] = useState('Scouting market vibes...');

  const handleLaunch = async () => {
    setStep('GENERATING');
    
    // Loading animation sequence simulating AI "Thinking"
    const phases = [
      "Analyzing market signals...",
      "Drafting validation experiments...",
      "Constructing landing page..."
    ];
    
    let phaseIndex = 0;
    const interval = setInterval(() => {
      phaseIndex = (phaseIndex + 1) % phases.length;
      setLoadingText(phases[phaseIndex]);
    }, 1500);

    try {
      // Call the mock/real service
      const plan = await generateValidationPlan(formData.idea, formData.target, formData.metric);
      
      clearInterval(interval);
      
      // Create a new project object
      const newProject: Project = {
        id: Date.now().toString(),
        name: "Untitled Project", // In real app, AI would generate a name
        pitch: formData.idea,
        lastEdited: 'Just now',
        validationScore: 0,
        stage: 'Idea',
        tags: ['New'],
        revenue: '$0'
      };
      
      onCreated(newProject);
    } catch (error) {
      console.error("Failed to generate", error);
      setStep('INPUT'); // Go back on error
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-[#0F1113] border border-white/10 rounded-2xl shadow-2xl shadow-black overflow-hidden transform transition-all animate-slide-up">
        
        {step === 'INPUT' && (
          <div className="p-8">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-2xl font-display font-bold text-white mb-2">Quick Validation Plan</h2>
                <p className="text-text-muted">Go from fuzzy idea to actionable blueprint in 60 seconds.</p>
              </div>
              <button onClick={onClose} className="text-text-muted hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-muted">What's the idea?</label>
                <textarea 
                  value={formData.idea}
                  onChange={(e) => setFormData({...formData, idea: e.target.value})}
                  placeholder="e.g. A marketplace for renting unused backyard space for urban farming."
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-text-main focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none h-24 placeholder:text-text-muted/30"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-muted">Who is it for?</label>
                  <input 
                    type="text" 
                    value={formData.target}
                    onChange={(e) => setFormData({...formData, target: e.target.value})}
                    placeholder="e.g. Urban millennials, Gardeners"
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-text-main focus:border-primary outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-muted">Dream Metric</label>
                  <select 
                    value={formData.metric}
                    onChange={(e) => setFormData({...formData, metric: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-text-main focus:border-primary outline-none appearance-none"
                  >
                    <option>Sign-ups / Waitlist</option>
                    <option>Pre-orders (Revenue)</option>
                    <option>User Interviews</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-10 flex justify-end">
               <Button 
                 variant="primary" 
                 size="lg" 
                 onClick={handleLaunch}
                 disabled={!formData.idea}
                 className="w-full md:w-auto group"
               >
                 <Sparkles size={18} className="mr-2 group-hover:text-white" />
                 Launch Quick Plan
                 <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
               </Button>
            </div>
          </div>
        )}

        {step === 'GENERATING' && (
          <div className="p-16 flex flex-col items-center justify-center text-center min-h-[400px]">
            <div className="w-20 h-20 relative mb-8">
              <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <Film size={24} className="text-primary animate-pulse" />
              </div>
            </div>
            <h3 className="text-xl font-medium text-white mb-2">Studio Assistant is working</h3>
            <p className="text-text-muted font-mono text-sm animate-pulse-slow">{loadingText}</p>
          </div>
        )}
        
        {/* Aesthetic colored blur at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary opacity-50"></div>
      </div>
    </div>
  );
};

export default QuickIdeaModal;