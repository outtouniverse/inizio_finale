
import React, { useEffect, useState } from 'react';
import { StorageService } from '../services/storageService';
import { UserProfile, Project } from '../types';
import { Trophy, Flame, Target, ArrowLeft, Activity, Zap, Brain, Calendar, Grid } from 'lucide-react';
import MemoryGraph from './profile/MemoryGraph';
import FounderTimeline from './profile/FounderTimeline';
import ExecutionHeatmap from './profile/ExecutionHeatmap';

const ProfileView: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'MEMORY' | 'JOURNEY'>('DASHBOARD');

  useEffect(() => {
    setProfile(StorageService.getProfile());
    setProjects(StorageService.getProjects());
  }, []);

  if (!profile) return null;

  const validatedIdeas = projects.filter(p => p.stage === 'Validation' || p.stage === 'Build').length;

  return (
    <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-md h-full w-full flex flex-col animate-fade-in overflow-hidden">
      
      {/* Header Bar */}
      <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-black/50 backdrop-blur-md z-20 flex-none">
          <button onClick={onClose} className="flex items-center text-text-muted hover:text-white interactive group">
            <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-mono tracking-widest">BACK TO VAULT</span>
          </button>
          <div className="flex gap-4">
             <TabButton active={activeTab === 'DASHBOARD'} onClick={() => setActiveTab('DASHBOARD')} icon={Grid} label="Dashboard" />
             <TabButton active={activeTab === 'MEMORY'} onClick={() => setActiveTab('MEMORY')} icon={Brain} label="Brain Map" />
             <TabButton active={activeTab === 'JOURNEY'} onClick={() => setActiveTab('JOURNEY')} icon={Calendar} label="Timeline" />
          </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
         {/* Background Patterns */}
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none fixed"></div>
         
         <div className="max-w-6xl mx-auto space-y-8 pb-20">
            
            {/* Identity Header */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
               <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-white/10 flex items-center justify-center shadow-2xl relative overflow-hidden group">
                  <span className="text-4xl md:text-5xl z-10">👨‍💻</span>
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity blur-md"></div>
               </div>
               <div className="text-center md:text-left">
                  <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">{profile.name}</h1>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                     <span className="text-primary font-mono text-xs uppercase tracking-widest px-2 py-1 rounded bg-primary/10 border border-primary/20">{profile.archetype}</span>
                     <span className="text-text-muted text-xs font-mono">LVL {profile.level}</span>
                  </div>
                  <p className="mt-4 text-lg text-white/80 font-light max-w-xl">"{profile.mission}"</p>
               </div>
            </div>

            {/* Content Switcher */}
            {activeTab === 'DASHBOARD' && (
               <div className="space-y-8 animate-slide-up">
                  {/* Stats Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <StatBox label="Build Streak" value="12 Days" icon={Flame} color="text-orange-500" />
                     <StatBox label="Validated Ideas" value={validatedIdeas.toString()} icon={Activity} color="text-blue-500" />
                     <StatBox label="System Power" value="98%" icon={Zap} color="text-yellow-500" />
                  </div>
                  
                  {/* Heatmap */}
                  <ExecutionHeatmap />
               </div>
            )}

            {activeTab === 'MEMORY' && (
               <div className="animate-slide-up">
                  <MemoryGraph />
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                        <h3 className="text-white font-bold mb-4">Core Strengths</h3>
                        <div className="flex flex-wrap gap-2">
                           <span className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-xs">Product Design</span>
                           <span className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-xs">Vision</span>
                        </div>
                     </div>
                     <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                        <h3 className="text-white font-bold mb-4">Growth Areas</h3>
                        <div className="flex flex-wrap gap-2">
                           <span className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full text-xs">B2B Sales</span>
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {activeTab === 'JOURNEY' && (
               <div className="animate-slide-up space-y-8">
                  <FounderTimeline />
                  <div className="p-8 bg-white/5 border border-white/10 rounded-2xl">
                     <h3 className="text-xl font-display font-bold text-white mb-6">Milestone Log</h3>
                     <div className="space-y-6 border-l border-white/10 ml-2 pl-8">
                        {/* Mock Log Items */}
                        {[1,2,3].map(i => (
                           <div key={i} className="relative">
                              <div className="absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-black border border-white/30"></div>
                              <div className="text-xs font-mono text-text-muted mb-1">Oct {10 + i}, 2024</div>
                              <div className="text-white font-medium">Completed System Setup</div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            )}
            
         </div>
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, icon: Icon, label }: any) => (
   <button 
      onClick={onClick}
      className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all text-xs font-bold uppercase tracking-wider ${
         active ? 'bg-white text-black' : 'text-text-muted hover:text-white hover:bg-white/10'
      }`}
   >
      <Icon size={14} />
      <span className="hidden md:inline">{label}</span>
   </button>
);

const StatBox = ({ label, value, icon: Icon, color }: any) => (
  <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] flex items-center justify-between">
     <div>
        <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider block mb-1">{label}</span>
        <div className="text-3xl font-bold text-white font-display">{value}</div>
     </div>
     <Icon size={24} className={`${color} opacity-80`} />
  </div>
);

export default ProfileView;
