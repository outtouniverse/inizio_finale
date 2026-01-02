import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  onComplete: () => void;
}

const BootSequence: React.FC<Props> = ({ onComplete }) => {
  const [text, setText] = useState("");
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setText("ENTERING FOUNDER MODE...");
    }, 1500);
    
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3500);

    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center">
      
      {/* Neon Heartbeat Line */}
      <div className="w-full max-w-md h-[1px] bg-white/5 relative overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent w-1/2 animate-scan-line"></div>
      </div>

      {/* Text Reveal */}
      <motion.div
        initial={{ opacity: 0, letterSpacing: '0.5em' }}
        animate={{ opacity: 1, letterSpacing: '0.2em' }}
        transition={{ duration: 1.5, delay: 1.5 }}
        className="text-xs font-mono text-primary uppercase tracking-widest"
      >
        {text}
      </motion.div>

      {/* Sub-particles */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 2, delay: 2 }}
        className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none"
      />
    </div>
  );
};

export default BootSequence;