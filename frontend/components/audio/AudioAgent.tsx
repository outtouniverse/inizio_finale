
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Phone, X, MessageSquare, Activity, Volume2, Play, StopCircle } from 'lucide-react';
import { CallPersona, CallMessage } from '../../types';
import { MOCK_PERSONAS } from '../../constants';
import { speakStreaming } from '../../services/geminiService';
import Button from '../ui/Button';
import Card from '../ui/Card';

interface Props {
  onClose: () => void;
}

type CallState = 'PERSONA_SELECT' | 'PREP' | 'LIVE' | 'SUMMARY';

const AudioAgent: React.FC<Props> = ({ onClose }) => {
  const [state, setState] = useState<CallState>('PERSONA_SELECT');
  const [activePersona, setActivePersona] = useState<CallPersona | null>(null);
  const [messages, setMessages] = useState<CallMessage[]>([]);
  const [isTalking, setIsTalking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleStartCall = () => {
    setState('LIVE');
    // Initial greeting
    setTimeout(() => {
      addMessage('AGENT', `Hey! I'm looking at your idea. Can you pitch it to me in one sentence?`);
      speakStreaming("Hey! I'm looking at your idea. Can you pitch it to me in one sentence?");
    }, 1000);
  };

  const addMessage = (sender: 'USER' | 'AGENT', text: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      sender,
      text,
      timestamp: Date.now()
    }]);
  };

  const handleSendText = () => {
    if (!inputText.trim()) return;
    addMessage('USER', inputText);
    setInputText('');
    
    // Mock AI Response
    setTimeout(() => {
        const response = "That's interesting. But how do you plan to acquire the first 100 users without a budget?";
        addMessage('AGENT', response);
        speakStreaming(response);
    }, 1500);
  };

  const handleEndCall = () => {
    setState('SUMMARY');
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black animate-fade-in">
      
      {/* Header */}
      <div className="flex-none h-16 px-6 border-b border-white/10 flex justify-between items-center bg-[#0A0A0C]">
         <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${state === 'LIVE' ? 'bg-red-500 animate-pulse' : 'bg-white/20'}`}></div>
            <span className="font-mono text-xs uppercase tracking-widest text-white">
                {state === 'LIVE' ? 'Live Session' : 'Audio Agent'}
            </span>
         </div>
         <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-text-muted hover:text-white">
            <X size={20} />
         </button>
      </div>

      <div className="flex-1 overflow-hidden relative flex">
         
         {/* Main Content Area */}
         <div className="flex-1 relative flex flex-col">
            
            {/* PERSONA SELECTION */}
            {state === 'PERSONA_SELECT' && (
               <div className="flex-1 flex flex-col items-center justify-center p-8">
                  <h2 className="text-3xl font-display font-bold text-white mb-2">Choose Your Caller</h2>
                  <p className="text-text-muted mb-12">Who do you want to test your pitch against?</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-5xl">
                     {MOCK_PERSONAS.map(p => (
                        <div 
                           key={p.id}
                           onClick={() => setActivePersona(p)}
                           className={`p-6 rounded-2xl border cursor-pointer transition-all hover:-translate-y-2 ${activePersona?.id === p.id ? 'bg-white/10 border-primary shadow-[0_0_30px_rgba(46,199,255,0.2)]' : 'bg-white/5 border-white/10 hover:border-white/30'}`}
                        >
                           <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                              <p.icon size={24} className="text-white" />
                           </div>
                           <h3 className="font-bold text-white mb-1">{p.name}</h3>
                           <p className="text-xs text-text-muted mb-4">{p.description}</p>
                           <span className="text-[10px] uppercase tracking-wider font-mono text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20">{p.tone}</span>
                        </div>
                     ))}
                  </div>

                  <div className="mt-12">
                     <Button 
                        disabled={!activePersona} 
                        onClick={() => setState('PREP')}
                        size="lg"
                        className="px-12"
                     >
                        Next: Call Prep
                     </Button>
                  </div>
               </div>
            )}

            {/* PREP SCREEN */}
            {state === 'PREP' && activePersona && (
               <div className="flex-1 flex flex-col items-center justify-center p-8 animate-slide-up">
                  <div className="w-full max-w-md bg-[#121214] border border-white/10 rounded-3xl p-8 shadow-2xl">
                     <div className="flex items-center gap-4 mb-8">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                           <activePersona.icon size={32} className="text-white" />
                        </div>
                        <div>
                           <h3 className="text-xl font-bold text-white">{activePersona.name}</h3>
                           <p className="text-sm text-text-muted">Ready to connect.</p>
                        </div>
                     </div>

                     <div className="space-y-4 mb-8">
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                           <span className="text-sm text-white">Read Project Context</span>
                           <div className="w-10 h-5 bg-primary rounded-full relative"><div className="absolute right-1 top-1 w-3 h-3 bg-black rounded-full"></div></div>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                           <span className="text-sm text-white">Access Market Data</span>
                           <div className="w-10 h-5 bg-primary rounded-full relative"><div className="absolute right-1 top-1 w-3 h-3 bg-black rounded-full"></div></div>
                        </div>
                     </div>

                     <Button onClick={handleStartCall} variant="primary" className="w-full py-4 text-lg group">
                        <Phone size={20} className="mr-2 group-hover:animate-pulse" /> Start Call
                     </Button>
                  </div>
               </div>
            )}

            {/* LIVE CALL */}
            {state === 'LIVE' && activePersona && (
               <div className="flex-1 flex flex-col relative">
                  
                  {/* Main Visualizer */}
                  <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
                     {/* Background Glow */}
                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] animate-pulse"></div>
                     </div>

                     <div className="relative z-10 text-center mb-12">
                        <div className="w-32 h-32 rounded-full bg-black border border-white/10 flex items-center justify-center mb-6 relative shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                           <activePersona.icon size={48} className="text-white opacity-80" />
                           {/* Waveform ring */}
                           <div className="absolute inset-0 rounded-full border border-primary/30 animate-ping opacity-20"></div>
                           <div className="absolute -inset-4 rounded-full border border-white/5 animate-spin-slow-reverse border-dashed"></div>
                        </div>
                        <h2 className="text-2xl font-bold text-white">{activePersona.name}</h2>
                        <div className="text-primary font-mono text-xs mt-2 animate-pulse">SPEAKING...</div>
                     </div>

                     {/* Captions */}
                     <div className="max-w-2xl w-full px-8 h-32 overflow-y-auto no-scrollbar text-center mask-linear-fade">
                        <div className="space-y-4">
                           {messages.map((msg) => (
                              <motion.div 
                                 key={msg.id}
                                 initial={{ opacity: 0, y: 20 }}
                                 animate={{ opacity: 1, y: 0 }}
                                 className={`text-lg md:text-xl font-medium leading-relaxed ${msg.sender === 'AGENT' ? 'text-white' : 'text-white/50'}`}
                              >
                                 {msg.text}
                              </motion.div>
                           ))}
                           <div ref={messagesEndRef} />
                        </div>
                     </div>
                  </div>

                  {/* Controls */}
                  <div className="h-24 border-t border-white/10 bg-black/50 backdrop-blur-md flex items-center justify-between px-8">
                     <div className="flex items-center gap-4 w-1/3">
                        <button 
                           onClick={() => setIsMuted(!isMuted)}
                           className={`p-3 rounded-full border ${isMuted ? 'bg-red-500/20 text-red-500 border-red-500/50' : 'bg-white/5 text-white border-white/10 hover:bg-white/10'}`}
                        >
                           {isMuted ? <X size={20} /> : <Mic size={20} />}
                        </button>
                     </div>

                     <div className="flex justify-center w-1/3">
                        <button 
                           onMouseDown={() => setIsTalking(true)}
                           onMouseUp={() => setIsTalking(false)}
                           className={`w-16 h-16 rounded-full border-4 flex items-center justify-center transition-all ${
                              isTalking 
                              ? 'bg-primary border-primary/50 shadow-[0_0_30px_var(--primary)] scale-110' 
                              : 'bg-white border-white/20 hover:scale-105'
                           }`}
                        >
                           <Mic size={24} className={isTalking ? 'text-black' : 'text-black'} />
                        </button>
                     </div>

                     <div className="flex justify-end w-1/3">
                        <Button variant="danger" onClick={handleEndCall}>
                           End Call
                        </Button>
                     </div>
                  </div>

                  {/* Floating Input for Text */}
                  <div className="absolute bottom-28 left-1/2 -translate-x-1/2 w-full max-w-lg px-4">
                     <div className="relative">
                        <input 
                           type="text" 
                           value={inputText}
                           onChange={(e) => setInputText(e.target.value)}
                           onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
                           placeholder="Type a message..."
                           className="w-full bg-black/80 border border-white/20 rounded-full py-3 px-6 text-white placeholder-white/30 focus:border-primary outline-none backdrop-blur-xl"
                        />
                        <button 
                           onClick={handleSendText}
                           className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/10 rounded-full hover:bg-white/20 text-white transition-colors"
                        >
                           <MessageSquare size={16} />
                        </button>
                     </div>
                  </div>

               </div>
            )}

            {/* SUMMARY SCREEN */}
            {state === 'SUMMARY' && (
               <div className="flex-1 flex flex-col items-center justify-center p-8 animate-slide-up">
                  <div className="w-full max-w-2xl">
                     <h2 className="text-3xl font-display font-bold text-white mb-8 text-center">Call Summary</h2>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <Card>
                           <h3 className="font-bold text-white mb-4 flex items-center"><Activity size={18} className="mr-2 text-primary"/> Action Items</h3>
                           <ul className="space-y-3 text-sm text-text-muted">
                              <li className="flex items-start"><span className="mr-2 text-primary">•</span> Refine the pricing model for SMEs.</li>
                              <li className="flex items-start"><span className="mr-2 text-primary">•</span> Clarify the 'No-Code' value prop.</li>
                              <li className="flex items-start"><span className="mr-2 text-primary">•</span> Add a comparison chart vs Notion.</li>
                           </ul>
                        </Card>
                        <Card>
                           <h3 className="font-bold text-white mb-4 flex items-center"><MessageSquare size={18} className="mr-2 text-secondary"/> Key Insight</h3>
                           <p className="text-sm text-text-muted italic">"The customer liked the vision but was confused about the implementation timeline. Simplify the onboarding pitch."</p>
                        </Card>
                     </div>

                     <div className="flex justify-center gap-4">
                        <Button variant="outline" onClick={onClose}>Close</Button>
                        <Button variant="primary">Save to Vault</Button>
                     </div>
                  </div>
               </div>
            )}

         </div>

         {/* Right Context Feed (Live Mode Only) */}
         {state === 'LIVE' && (
            <div className="w-80 border-l border-white/10 bg-[#08080A] p-6 hidden lg:flex flex-col">
               <h3 className="text-xs font-mono uppercase text-text-muted mb-6 tracking-widest">Context Feed</h3>
               <div className="space-y-4">
                  {['Validation Report', 'Competitor Analysis', 'Pricing Model'].map((item, i) => (
                     <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary/30 transition-colors cursor-pointer group">
                        <div className="flex items-center justify-between mb-2">
                           <span className="text-sm font-bold text-white group-hover:text-primary">{item}</span>
                           <div className="w-2 h-2 rounded-full bg-primary opacity-0 group-hover:opacity-100 animate-pulse"></div>
                        </div>
                        <div className="h-2 w-2/3 bg-white/10 rounded mb-1"></div>
                        <div className="h-2 w-1/2 bg-white/10 rounded"></div>
                     </div>
                  ))}
               </div>
            </div>
         )}

      </div>
    </div>
  );
};

export default AudioAgent;
