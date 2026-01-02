
import React from 'react';
import { Zap, Coffee, Wallet } from 'lucide-react';
import Button from './Button';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const QuotaModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-[#0F1113] border border-primary/30 rounded-2xl shadow-[0_0_50px_rgba(46,199,255,0.2)] overflow-hidden transform transition-all scale-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/20 to-transparent p-6 border-b border-white/5">
           <div className="flex items-center space-x-3 text-primary">
              <Zap className="animate-pulse" size={24} />
              <h2 className="text-xl font-display font-bold text-white">System Overload</h2>
           </div>
        </div>

        <div className="p-8">
           <div className="text-center mb-8">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10 relative">
                 <span className="text-4xl">💸</span>
                 <div className="absolute -bottom-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full border border-[#0F1113]">429</div>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">The AI is resting.</h3>
              <p className="text-text-muted leading-relaxed">
                You're building too fast, founder! We hit the API rate limit. 
                This is the digital equivalent of running out of ramen money.
              </p>
           </div>

           <div className="bg-white/5 rounded-xl p-4 mb-8 border border-white/5">
              <div className="flex items-start space-x-3">
                 <Coffee className="text-yellow-500 mt-1 flex-shrink-0" size={18} />
                 <div className="text-sm">
                    <p className="text-white font-medium mb-1">Why did this happen?</p>
                    <p className="text-text-muted">We're using the free tier models to keep your burn rate at $0. Give it a minute to cool down.</p>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <Button variant="secondary" onClick={onClose} className="w-full">
                 I'll Wait (Cool off)
              </Button>
              <Button variant="primary" onClick={() => window.open('https://aistudio.google.com/', '_blank')} className="w-full">
                 <Wallet size={16} className="mr-2" /> Upgrade (JK)
              </Button>
           </div>
        </div>

      </div>
    </div>
  );
};

export default QuotaModal;
