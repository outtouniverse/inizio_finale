

import React, { useState, useEffect } from 'react';
import { Settings, Cpu, Shield, Volume2, Zap, Eye, LayoutGrid } from 'lucide-react';
import { AppSettings } from '../types';
import Button from './ui/Button';

interface SettingsViewProps {
  onClose: () => void;
  settings: AppSettings;
  onSave: (s: AppSettings) => void;
}

type Tab = 'PERSONALITY' | 'THEME' | 'PRIVACY' | 'AUDIO';

const SettingsView: React.FC<SettingsViewProps> = ({ onClose, settings, onSave }) => {
  const [activeTab, setActiveTab] = useState<Tab>('PERSONALITY');
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  const [hasChanges, setHasChanges] = useState(false);

  // ESC key listener
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const updateSetting = (key: keyof AppSettings, value: any) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    setHasChanges(true);
  };

  const updatePersonality = (key: keyof AppSettings['aiPersonality'], value: any) => {
    const newSettings = {
      ...localSettings,
      aiPersonality: { ...localSettings.aiPersonality, [key]: value }
    };
    setLocalSettings(newSettings);
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(localSettings);
    setHasChanges(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center animate-fade-in">
       <div className="relative w-full max-w-5xl h-[80vh] bg-background border border-white/10 rounded-3xl overflow-hidden flex shadow-2xl">
          
          <button onClick={onClose} className="absolute top-6 right-6 text-text-muted hover:text-text-main interactive z-20 font-mono text-xs tracking-widest">CLOSE [ESC]</button>

          {/* Sidebar */}
          <div className="w-64 border-r border-white/5 p-8 flex flex-col bg-surface">
             <h2 className="text-xl font-display font-bold text-text-main mb-8 flex items-center">
               <Settings className="mr-3 text-primary" size={20} /> Controls
             </h2>
             <nav className="space-y-2">
               <NavItem active={activeTab === 'PERSONALITY'} label="AI Personality" icon={Cpu} onClick={() => setActiveTab('PERSONALITY')} />
               <NavItem active={activeTab === 'THEME'} label="Interface Themes" icon={Zap} onClick={() => setActiveTab('THEME')} />
               <NavItem active={activeTab === 'PRIVACY'} label="Privacy" icon={Shield} onClick={() => setActiveTab('PRIVACY')} />
               <NavItem active={activeTab === 'AUDIO'} label="Audio" icon={Volume2} onClick={() => setActiveTab('AUDIO')} />
             </nav>

             <div className="mt-auto">
                {hasChanges && (
                  <Button variant="primary" size="sm" onClick={handleSave} className="w-full">
                    Save Changes
                  </Button>
                )}
             </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-background">
             
             {/* Background Decoration */}
             <div className="absolute w-[600px] h-[600px] border border-primary/5 rounded-full animate-spin-slow opacity-20 pointer-events-none"></div>
             
             {/* Content Tabs */}
             <div className="relative z-10 w-full max-w-3xl p-8 h-full overflow-y-auto">
                
                {activeTab === 'PERSONALITY' && (
                  <div className="animate-slide-up pt-12">
                    <div className="text-center mb-12">
                       <div className="w-24 h-24 mx-auto bg-primary/5 rounded-full border border-primary/20 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(46,199,255,0.1)]">
                          <Cpu size={40} className="text-primary" />
                       </div>
                       <h3 className="text-2xl text-text-main font-bold">Co-Founder Archetype</h3>
                       <p className="text-text-muted">Adjust how the AI interacts with you.</p>
                    </div>

                    <div className="space-y-8">
                       <Slider 
                         label="Creativity" 
                         value={localSettings.aiPersonality.creativity} 
                         onChange={(v) => updatePersonality('creativity', v)} 
                       />
                       <Slider 
                         label="Risk Tolerance" 
                         value={localSettings.aiPersonality.risk}
                         onChange={(v) => updatePersonality('risk', v)}
                       />
                       <Slider 
                         label="Verbosity" 
                         value={localSettings.aiPersonality.verbosity}
                         onChange={(v) => updatePersonality('verbosity', v)}
                       />
                    </div>

                    <div className="flex justify-center mt-12 gap-4">
                       <OptionButton 
                         label="Strategic" 
                         active={localSettings.aiPersonality.archetype === 'Strategic'} 
                         onClick={() => updatePersonality('archetype', 'Strategic')}
                       />
                       <OptionButton 
                         label="Technical" 
                         active={localSettings.aiPersonality.archetype === 'Technical'} 
                         onClick={() => updatePersonality('archetype', 'Technical')}
                       />
                       <OptionButton 
                         label="Visionary" 
                         active={localSettings.aiPersonality.archetype === 'Visionary'} 
                         onClick={() => updatePersonality('archetype', 'Visionary')}
                       />
                    </div>
                  </div>
                )}

                {activeTab === 'THEME' && (
                  <div className="animate-slide-up pb-12">
                    <div className="mb-8">
                       <h3 className="text-2xl font-bold text-text-main">System Aesthetics</h3>
                       <p className="text-text-muted">Select a visual language for the OS.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <ThemeCard 
                          title="Neon Cyberwave" 
                          desc="Dark, glowing lines, high contrast." 
                          active={localSettings.theme === 'cyberwave'}
                          color="#2EC7FF"
                          onClick={() => updateSetting('theme', 'cyberwave')}
                       />
                       <ThemeCard 
                          title="Clean Minimal" 
                          desc="Bright, airy, soft shadows." 
                          active={localSettings.theme === 'minimal'}
                          color="#F3F4F6"
                          lightText
                          onClick={() => updateSetting('theme', 'minimal')}
                       />
                       <ThemeCard 
                          title="Indie Studio" 
                          desc="Warm beige, serif typography, cozy." 
                          active={localSettings.theme === 'studio'}
                          color="#D95D39"
                          onClick={() => updateSetting('theme', 'studio')}
                       />
                       <ThemeCard 
                          title="Hacker Terminal" 
                          desc="Monospace, green phosphorus, raw." 
                          active={localSettings.theme === 'terminal'}
                          color="#00FF41"
                          onClick={() => updateSetting('theme', 'terminal')}
                       />
                       <ThemeCard 
                          title="Nocturnal Pro" 
                          desc="Deep navy, gold accents, serious." 
                          active={localSettings.theme === 'nocturnal'}
                          color="#C0A062"
                          onClick={() => updateSetting('theme', 'nocturnal')}
                       />
                       <ThemeCard 
                          title="Vapor Mirage" 
                          desc="Soft gradients, dreamy atmosphere." 
                          active={localSettings.theme === 'vapor'}
                          color="#FF71CE"
                          onClick={() => updateSetting('theme', 'vapor')}
                       />
                    </div>
                  </div>
                )}

                {activeTab === 'PRIVACY' && (
                  <div className="animate-slide-up space-y-6 pt-12">
                    <h3 className="text-xl font-bold text-text-main mb-4">Data & Privacy</h3>
                    <Toggle 
                      label="Stealth Mode" 
                      desc="Hide project titles in public places." 
                      checked={localSettings.privacyMode}
                      onChange={(v) => updateSetting('privacyMode', v)}
                    />
                    <div className="p-4 bg-surface border border-white/10 rounded-lg">
                       <p className="text-sm text-text-muted">Your data is stored locally in your browser session for this demo.</p>
                    </div>
                  </div>
                )}

                {activeTab === 'AUDIO' && (
                  <div className="animate-slide-up space-y-6 pt-12">
                     <h3 className="text-xl font-bold text-text-main mb-4">Soundscapes</h3>
                     <Toggle 
                      label="Interface Sounds" 
                      desc="Subtle hums and clicks." 
                      checked={localSettings.soundEnabled}
                      onChange={(v) => updateSetting('soundEnabled', v)}
                    />
                  </div>
                )}

             </div>

          </div>
       </div>
    </div>
  );
};

const NavItem = ({ label, icon: Icon, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all interactive ${active ? 'bg-primary/10 text-primary border border-primary/20' : 'text-text-muted hover:text-text-main hover:bg-white/5 border border-transparent'}`}
  >
    <Icon size={18} className={active ? 'text-primary' : ''} />
    <span className="text-sm font-medium">{label}</span>
  </button>
);

const Slider = ({ label, value, onChange }: { label: string, value: number, onChange: (val: number) => void }) => (
  <div>
    <div className="flex justify-between mb-2">
      <span className="text-xs font-mono uppercase text-text-muted">{label}</span>
      <span className="text-xs font-mono text-primary">{value}%</span>
    </div>
    <input 
      type="range" 
      min="0" 
      max="100" 
      value={value} 
      onChange={(e) => onChange(parseInt(e.target.value))}
      className="w-full h-1 bg-surface rounded-lg appearance-none cursor-pointer accent-primary hover:accent-primary/80"
    />
  </div>
);

const OptionButton = ({ label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`px-6 py-2 rounded-full border text-sm interactive transition-all ${active ? 'border-primary bg-primary/10 text-text-main shadow-[0_0_15px_var(--primary)]' : 'border-white/10 text-text-muted hover:border-white/30'}`}
  >
    {label}
  </button>
);

const ThemeCard = ({ title, desc, active, color, lightText, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`p-6 rounded-xl border text-left transition-all interactive relative overflow-hidden group ${active ? 'border-primary bg-surface shadow-[0_0_20px_rgba(0,0,0,0.1)]' : 'border-white/10 hover:border-white/30'}`}
  >
     <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity" style={{ backgroundColor: color }}></div>
     <div className="relative z-10">
       <div className="w-8 h-8 rounded-full border border-white/20 mb-3" style={{ backgroundColor: color }}></div>
       <h4 className={`font-bold ${lightText && active ? 'text-black' : 'text-text-main'}`}>{title}</h4>
       <p className={`text-xs mt-1 ${lightText && active ? 'text-gray-600' : 'text-text-muted'}`}>{desc}</p>
     </div>
     {active && <div className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_var(--primary)]"></div>}
  </button>
);

const Toggle = ({ label, desc, checked, onChange }: any) => (
  <div className="flex items-center justify-between p-4 border border-white/10 rounded-lg bg-surface">
    <div>
       <h4 className="text-sm font-medium text-text-main">{label}</h4>
       <p className="text-xs text-text-muted">{desc}</p>
    </div>
    <button 
      onClick={() => onChange(!checked)}
      className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${checked ? 'bg-primary' : 'bg-white/10'}`}
    >
       <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${checked ? 'translate-x-6' : 'translate-x-0'}`}></div>
    </button>
  </div>
);

export default SettingsView;