
import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Phone, X, Volume2, AlertCircle, User, Zap } from 'lucide-react';
import { CallPersona, CallMessage, LiveSessionState } from '../../types';
import { LiveClient } from '../../services/liveClient';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface Props {
  persona: CallPersona;
  context: string;
  onEnd: () => void;
}

const LiveCallInterface: React.FC<Props> = ({ persona, context, onEnd }) => {
  const [sessionState, setSessionState] = useState<LiveSessionState>({
    isConnected: false,
    isSpeaking: false,
    isListening: false,
    volumeLevel: 0,
    error: null,
  });
  const [transcript, setTranscript] = useState<string>("");
  const [messages, setMessages] = useState<CallMessage[]>([]);
  
  const liveClientRef = useRef<LiveClient | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initCall = async () => {
      const apiKey = process.env.API_KEY || '';
      if (!apiKey) {
        setSessionState(s => ({ ...s, error: "API Key missing" }));
        return;
      }

      liveClientRef.current = new LiveClient(
        apiKey,
        (text, isPartial) => {
           setTranscript(text);
           // Simple heuristic to detect end of turn for message history
           if (!isPartial && text.length > 0) {
              setMessages(prev => {
                 // Avoid duplicates if rapidly firing
                 if (prev.length > 0 && prev[prev.length-1].text === text) return prev;
                 return [...prev, { id: Date.now().toString(), sender: 'AGENT', text, timestamp: Date.now() }];
              });
           }
        },
        (volume) => {
           setSessionState(s => ({ 
               ...s, 
               volumeLevel: volume,
               isListening: volume > 0.01 // Simple VAD threshold
           }));
        },
        (connected) => setSessionState(s => ({ ...s, isConnected: connected })),
        (error) => setSessionState(s => ({ ...s, error }))
      );

      await liveClientRef.current.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        systemInstruction: `You are ${persona.name}, ${persona.description}. ${persona.instructions}. 
        The user is pitching you this idea: "${context}". 
        Keep your responses concise, conversational, and react naturally to what they say. 
        Do not act like an AI assistant, act like the persona.`
      });
    };

    initCall();

    return () => {
      liveClientRef.current?.disconnect();
    };
  }, [persona, context]);

  useEffect(() => {
     if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
     }
  }, [messages, transcript]);

  return (
    <div className="fixed inset-0 z-[120] bg-black flex flex-col animate-fade-in">
       
       {/* Cinematic Header */}
       <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-20 pointer-events-none">
          <div className="pointer-events-auto flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
             <div className={`w-2 h-2 rounded-full ${sessionState.isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
             <span className="text-xs font-mono uppercase tracking-widest text-white">
                {sessionState.isConnected ? 'LIVE CONNECTION' : 'CONNECTING...'}
             </span>
          </div>
          <button onClick={onEnd} className="pointer-events-auto p-3 rounded-full bg-red-500/20 hover:bg-red-500 text-white transition-all border border-red-500/50 hover:scale-110">
             <Phone size={24} className="rotate-[135deg]" />
          </button>
       </div>

       {/* Main Visualizer Area */}
       <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
          
          {/* Ambient Glow */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] transition-all duration-100"
            style={{ 
               opacity: 0.3 + sessionState.volumeLevel * 5,
               transform: `translate(-50%, -50%) scale(${1 + sessionState.volumeLevel * 2})`
            }}
          ></div>

          {/* Persona Avatar */}
          <div className="relative z-10 mb-12">
             <div className="w-40 h-40 rounded-full border border-white/10 bg-black/50 backdrop-blur-md flex items-center justify-center shadow-[0_0_60px_rgba(0,0,0,0.5)] relative">
                {/* Dynamic Ring */}
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                   <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                   <circle 
                      cx="50" cy="50" r="48" fill="none" stroke="#2EC7FF" strokeWidth="2" 
                      strokeDasharray="300"
                      strokeDashoffset={300 - (sessionState.volumeLevel * 1000)}
                      className="transition-all duration-100"
                   />
                </svg>
                
                <User size={48} className="text-white opacity-80" />
             </div>
             <div className="text-center mt-6">
                <h2 className="text-3xl font-display font-bold text-white mb-1">{persona.name}</h2>
                <p className="text-text-muted text-sm uppercase tracking-widest">{persona.tone}</p>
             </div>
          </div>

          {/* Live Captions / Transcript */}
          <div className="w-full max-w-3xl px-8 h-48 overflow-y-auto text-center relative z-20 mask-linear-fade no-scrollbar" ref={scrollRef}>
             <AnimatePresence mode="popLayout">
                {messages.map((msg) => (
                   <motion.div 
                      key={msg.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 0.6, y: 0 }}
                      className={`text-lg font-medium mb-4 ${msg.sender === 'AGENT' ? 'text-white' : 'text-blue-400'}`}
                   >
                      {msg.text}
                   </motion.div>
                ))}
             </AnimatePresence>
             {transcript && (
                <motion.div 
                   initial={{ opacity: 0 }} 
                   animate={{ opacity: 1 }} 
                   className="text-2xl md:text-3xl font-medium text-white leading-relaxed drop-shadow-lg"
                >
                   "{transcript}"
                </motion.div>
             )}
          </div>

          {/* Status Indicators */}
          {sessionState.error && (
             <div className="absolute bottom-32 bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-2 rounded-lg flex items-center gap-2">
                <AlertCircle size={16} /> {sessionState.error}
             </div>
          )}
       </div>

       {/* Footer Controls */}
       <div className="h-24 bg-[#0A0A0C] border-t border-white/10 flex items-center justify-center gap-8 relative z-20">
          <div className="text-text-muted text-xs font-mono absolute left-8 hidden md:block">
             LATENCY: 24ms <br/>
             MODEL: GEMINI 2.5 FLASH AUDIO
          </div>

          {/* Mic Indicator */}
          <div className={`p-4 rounded-full border transition-all duration-300 ${sessionState.isListening ? 'bg-primary text-black border-primary scale-110' : 'bg-white/5 text-white border-white/10'}`}>
             <Mic size={24} />
          </div>
       </div>

    </div>
  );
};

export default LiveCallInterface;
