
import React, { useEffect, useState } from 'react';
import { StorageService } from '../services/storageService';
import { authService } from '../services/authService';
import { UserProfile, Project } from '../types';
import { Trophy, Flame, Target, ArrowLeft, Activity, Zap, Brain, Calendar, Grid, Loader, Edit3, Save, X, Plus, Trash2 } from 'lucide-react';
import MemoryGraph from './profile/MemoryGraph';
import FounderTimeline from './profile/FounderTimeline';
import ExecutionHeatmap from './profile/ExecutionHeatmap';

const ProfileView: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [profileStats, setProfileStats] = useState<any>(null);
  const [activityData, setActivityData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'MEMORY' | 'JOURNEY'>('DASHBOARD');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<UserProfile>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load data from multiple sources
        const [userProfile, projectsData, stats, activity] = await Promise.all([
          authService.getProfile(),
          StorageService.getProjects(),
          authService.getProfileStats(),
          authService.getProfileActivity()
        ]);

        // Transform user data to match UserProfile interface
        const transformedProfile: UserProfile = {
          name: userProfile.username,
          archetype: userProfile.archetype || 'Visionary Architect',
          level: userProfile.level || 1,
          mission: userProfile.mission || '',
          badges: userProfile.badges || [],
          traits: userProfile.traits || [],
          profilePicture: userProfile.profilePicture
        };

        setProfile(transformedProfile);
        setProjects(projectsData);
        setProfileStats(stats);
        setActivityData(activity);
      } catch (err) {
        console.error('Failed to load profile data:', err);
        setError('Failed to load profile data');
        // Fallback to localStorage
        setProfile(StorageService.getProfile());
        setProjects(StorageService.getProjects());
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-md h-full w-full flex flex-col items-center justify-center">
        <Loader className="animate-spin text-primary mb-4" size={48} />
        <p className="text-white/70">Loading your profile...</p>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-md h-full w-full flex flex-col items-center justify-center">
        <p className="text-red-400 mb-4">{error}</p>
        <button onClick={onClose} className="text-white/70 hover:text-white">
          Close
        </button>
      </div>
    );
  }

  if (!profile) return null;

  const validatedIdeas = projects.filter(p => p.stage === 'Validation' || p.stage === 'Build').length;

  return (
    <div className="fixed inset-0 z-[60] mt-16 bg-black/95 backdrop-blur-md h-full w-full flex flex-col animate-fade-in overflow-hidden">
      
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
             {!isEditing ? (
               <button
                 onClick={() => {
                   setIsEditing(true);
                   setEditForm({ ...profile });
                 }}
                 className="flex items-center text-text-muted hover:text-white interactive group px-4 py-2 rounded-full transition-all"
               >
                 <Edit3 size={14} className="mr-2" />
                 <span className="text-xs font-mono tracking-widest">EDIT</span>
               </button>
             ) : (
               <div className="flex gap-2">
                 <button
                   onClick={async () => {
                     setSaving(true);
                     try {
                       await StorageService.syncProfileToBackend(editForm as UserProfile);
                       setProfile(editForm as UserProfile);
                       setIsEditing(false);
                     } catch (error) {
                       console.error('Failed to save profile:', error);
                       setError('Failed to save profile changes');
                     } finally {
                       setSaving(false);
                     }
                   }}
                   disabled={saving}
                   className="flex items-center text-green-400 hover:text-green-300 interactive group px-4 py-2 rounded-full transition-all disabled:opacity-50"
                 >
                   <Save size={14} className="mr-2" />
                   <span className="text-xs font-mono tracking-widest">
                     {saving ? 'SAVING...' : 'SAVE'}
                   </span>
                 </button>
                 <button
                   onClick={() => {
                     setIsEditing(false);
                     setEditForm({});
                   }}
                   className="flex items-center text-red-400 hover:text-red-300 interactive group px-4 py-2 rounded-full transition-all"
                 >
                   <X size={14} className="mr-2" />
                   <span className="text-xs font-mono tracking-widest">CANCEL</span>
                 </button>
               </div>
             )}
          </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
         {/* Background Patterns */}
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none fixed"></div>
         
         <div className="max-w-6xl mx-auto space-y-8 pb-20">
            
            {/* Identity Header */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
               <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-white/10 flex items-center justify-center shadow-2xl relative overflow-hidden group">
                  {profile.profilePicture ? (
                    <img
                      src={profile.profilePicture}
                      alt={`${profile.name}'s profile`}
                      className="w-full h-full object-cover rounded-2xl"
                      onError={(e) => {
                        // Fallback to initials if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `<span class="text-2xl md:text-3xl font-bold text-white z-10">${profile.name?.charAt(0)?.toUpperCase() || 'U'}</span>`;
                        }
                      }}
                    />
                  ) : (
                    <span className="text-2xl md:text-3xl font-bold text-white z-10">
                      {profile.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  )}
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity blur-md"></div>
               </div>
               <div className="text-center md:text-left flex-1">
                  {isEditing ? (
                     <div className="space-y-4">
                        <input
                          type="text"
                          value={editForm.archetype || ''}
                          onChange={(e) => setEditForm({ ...editForm, archetype: e.target.value })}
                          placeholder="e.g., Visionary Architect, Strategic Builder, Creative Innovator..."
                          className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:border-primary focus:outline-none"
                        />
                        <textarea
                          value={editForm.mission || ''}
                          onChange={(e) => setEditForm({ ...editForm, mission: e.target.value })}
                          placeholder="Describe your vision and what drives you as an entrepreneur..."
                          rows={3}
                          className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:border-primary focus:outline-none resize-none"
                        />
                     </div>
                  ) : (
                     <>
                        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">@{profile.name}</h1>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                           <span className="text-primary font-mono text-xs uppercase tracking-widest px-2 py-1 rounded bg-primary/10">{profile.archetype}</span>
                           <span className="text-text-muted text-xs font-mono">LVL {profile.level}</span>
                        </div>
                        {profile.mission && (
                          <p className="mt-4 text-lg text-white/80 font-light max-w-xl leading-relaxed">
                            {profile.mission}
                          </p>
                        )}
                     </>
                  )}
               </div>
            </div>

            {/* Content Switcher */}
            {activeTab === 'DASHBOARD' && (
               <div className="space-y-8 animate-slide-up">
                  {/* Stats Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <StatBox
                       label="Build Streak"
                       value={profileStats ? `${profileStats.buildStreak} Days` : `${validatedIdeas} Days`}
                       icon={Flame}
                       color="text-orange-500"
                     />
                     <StatBox
                       label="Validated Ideas"
                       value={profileStats ? profileStats.validatedIdeas.toString() : validatedIdeas.toString()}
                       icon={Activity}
                       color="text-blue-500"
                     />
                     <StatBox
                       label="System Power"
                       value={profileStats ? `${profileStats.systemPower}%` : "98%"}
                       icon={Zap}
                       color="text-yellow-500"
                     />
                  </div>
                  
                  {/* Heatmap */}
                  <ExecutionHeatmap heatmapData={activityData?.heatmap} />
               </div>
            )}

            {activeTab === 'MEMORY' && (
               <div className="animate-slide-up">
                  <MemoryGraph profile={profile} projects={projects} />
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                        <h3 className="text-white font-bold mb-4">Core Strengths</h3>
                        {isEditing ? (
                          <div className="space-y-2">
                            {(editForm.traits || profile.traits || []).filter(trait => trait.score > 70).map((trait, index) => (
                              <div key={trait.name} className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={trait.name}
                                  onChange={(e) => {
                                    const updatedTraits = [...(editForm.traits || profile.traits || [])];
                                    updatedTraits[index] = { ...trait, name: e.target.value };
                                    setEditForm({ ...editForm, traits: updatedTraits });
                                  }}
                                  className="flex-1 bg-black/50 border border-white/20 rounded px-2 py-1 text-white text-xs focus:border-primary focus:outline-none"
                                />
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={trait.score}
                                  onChange={(e) => {
                                    const updatedTraits = [...(editForm.traits || profile.traits || [])];
                                    updatedTraits[index] = { ...trait, score: parseInt(e.target.value) || 0 };
                                    setEditForm({ ...editForm, traits: updatedTraits });
                                  }}
                                  className="w-16 bg-black/50 border border-white/20 rounded px-2 py-1 text-white text-xs focus:border-primary focus:outline-none"
                                />
                                <button
                                  onClick={() => {
                                    const updatedTraits = (editForm.traits || profile.traits || []).filter((_, i) => i !== index);
                                    setEditForm({ ...editForm, traits: updatedTraits });
                                  }}
                                  className="text-red-400 hover:text-red-300"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            ))}
                            <button
                              onClick={() => {
                                const updatedTraits = [...(editForm.traits || profile.traits || []), { name: 'New Trait', score: 50 }];
                                setEditForm({ ...editForm, traits: updatedTraits });
                              }}
                              className="flex items-center gap-1 text-primary hover:text-primary/80 text-xs"
                            >
                              <Plus size={12} />
                              Add Strength
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {profile.traits?.filter(trait => trait.score > 70).map(trait => (
                              <span key={trait.name} className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-xs">
                                {trait.name} ({trait.score})
                              </span>
                            )) || (
                              <>
                                <span className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-xs">Product Design</span>
                                <span className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-xs">Vision</span>
                              </>
                            )}
                          </div>
                        )}
                     </div>
                     <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                        <h3 className="text-white font-bold mb-4">Growth Areas</h3>
                        {isEditing ? (
                          <div className="space-y-2">
                            {(editForm.traits || profile.traits || []).filter(trait => trait.score < 50).map((trait, index) => (
                              <div key={trait.name} className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={trait.name}
                                  onChange={(e) => {
                                    const updatedTraits = [...(editForm.traits || profile.traits || [])];
                                    const originalIndex = (editForm.traits || profile.traits || []).findIndex(t => t.name === trait.name);
                                    updatedTraits[originalIndex] = { ...trait, name: e.target.value };
                                    setEditForm({ ...editForm, traits: updatedTraits });
                                  }}
                                  className="flex-1 bg-black/50 border border-white/20 rounded px-2 py-1 text-white text-xs focus:border-primary focus:outline-none"
                                />
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={trait.score}
                                  onChange={(e) => {
                                    const updatedTraits = [...(editForm.traits || profile.traits || [])];
                                    const originalIndex = (editForm.traits || profile.traits || []).findIndex(t => t.name === trait.name);
                                    updatedTraits[originalIndex] = { ...trait, score: parseInt(e.target.value) || 0 };
                                    setEditForm({ ...editForm, traits: updatedTraits });
                                  }}
                                  className="w-16 bg-black/50 border border-white/20 rounded px-2 py-1 text-white text-xs focus:border-primary focus:outline-none"
                                />
                                <button
                                  onClick={() => {
                                    const updatedTraits = (editForm.traits || profile.traits || []).filter(t => t.name !== trait.name);
                                    setEditForm({ ...editForm, traits: updatedTraits });
                                  }}
                                  className="text-red-400 hover:text-red-300"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            ))}
                            <button
                              onClick={() => {
                                const updatedTraits = [...(editForm.traits || profile.traits || []), { name: 'New Weakness', score: 30 }];
                                setEditForm({ ...editForm, traits: updatedTraits });
                              }}
                              className="flex items-center gap-1 text-primary hover:text-primary/80 text-xs"
                            >
                              <Plus size={12} />
                              Add Growth Area
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {profile.traits?.filter(trait => trait.score < 50).map(trait => (
                              <span key={trait.name} className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full text-xs">
                                {trait.name} ({trait.score})
                              </span>
                            )) || (
                              <span className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full text-xs">B2B Sales</span>
                            )}
                          </div>
                        )}
                     </div>
                  </div>
               </div>
            )}

            {activeTab === 'JOURNEY' && (
               <div className="animate-slide-up space-y-8">
                  <FounderTimeline timelineEvents={activityData?.timeline} />
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
