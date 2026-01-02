
import React, { useState } from 'react';
import { FeedbackType } from '../types';
import { X, MessageSquare, Sparkles, Zap, CornerDownLeft } from 'lucide-react';
import Button from './ui/Button';

interface Props {
  onClose: () => void;
  onSubmit: (type: FeedbackType, text: string, constraints: string) => void;
}

const FeedbackModal: React.FC<Props> = ({ onClose, onSubmit }) => {
  const [type, setType] = useState<FeedbackType>('ACCURACY');
  const [text, setText] = useState('');
  const [constraints, setConstraints] = useState('');

  const handleSubmit = () => {
    if (!text.trim()) return;
    onSubmit(type, text, constraints);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute top-0 inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-xl bg-[#0F1113] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden transform transition-all animate-slide-up">
         
         {/* Header */}
         <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <MessageSquare size={20} />
               </div>
               <div>
                  <h3 className="text-lg font-bold text-white">Critique & Refine</h3>
                  <p className="text-xs text-text-muted">The AI will rethink this node based on your input.</p>
               </div>
            </div>
            <button onClick={onClose} className="text-text-muted hover:text-white transition-colors">
               <X size={20} />
            </button>
         </div>

         <div className="p-6 space-y-6">
            
            {/* Type Selector */}
            <div className="space-y-2">
               <label className="text-xs font-mono text-text-muted uppercase">Feedback Focus</label>
               <div className="flex flex-wrap gap-2">
                  {(['ACCURACY', 'TONE', 'DEPTH', 'CREATIVITY', 'RISK'] as FeedbackType[]).map((t) => (
                     <button
                       key={t}
                       onClick={() => setType(t)}
                       className={`px-3 py-1.5 rounded text-xs font-bold border transition-all ${
                         type === t 
                           ? 'bg-white text-black border-white' 
                           : 'bg-transparent text-text-muted border-white/10 hover:border-white/30 hover:text-white'
                       }`}
                     >
                        {t}
                     </button>
                  ))}
               </div>
            </div>

            {/* Main Input */}
            <div className="space-y-2">
               <label className="text-xs font-mono text-text-muted uppercase">What needs changing?</label>
               <textarea 
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="e.g. The pricing feels too high for this market. Suggest a freemium tier..."
                  className="w-full h-32 bg-black/50 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
                  autoFocus
               />
            </div>

            {/* Constraints */}
            <div className="space-y-2">
               <label className="text-xs font-mono text-text-muted uppercase">Hard Constraints (Optional)</label>
               <input 
                  value={constraints}
                  onChange={(e) => setConstraints(e.target.value)}
                  placeholder="e.g. Budget < $5k, Must involve AI..."
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white placeholder-white/20 focus:border-primary outline-none"
               />
            </div>
         </div>

         <div className="p-6 border-t border-white/5 bg-white/[0.02] flex justify-end gap-3">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button variant="primary" onClick={handleSubmit} disabled={!text.trim()} className="group">
               <Sparkles size={16} className="mr-2 group-hover:text-black" />
               Rethink Node
            </Button>
         </div>

      </div>
    </div>
  );
};

export default FeedbackModal;
