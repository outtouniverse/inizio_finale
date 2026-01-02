
import React, { useState, useEffect } from 'react';
import { AppSettings } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
  onNavClick?: (dest: string) => void;
  settings?: AppSettings;
}

const Layout: React.FC<LayoutProps> = ({ children, showNav, onNavClick, settings }) => {
  const theme = settings?.theme || 'cyberwave';
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Apply theme data attribute to body
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="min-h-[100dvh] bg-background text-text-main flex flex-col font-sans selection:bg-primary/30 overflow-x-hidden relative transition-colors duration-500">
      
      {/* Minimal Ambience Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
         {/* Noise Grain */}
         <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay"></div>
         
         {theme === 'cyberwave' && (
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] mix-blend-overlay"></div>
         )}
         
         {theme === 'studio' && (
             <div className="absolute inset-0 bg-[#d4cdc5] opacity-10 mix-blend-multiply pointer-events-none"></div>
         )}

         {theme === 'vapor' && (
            <>
             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-purple-900/20 to-transparent"></div>
             <div className="absolute bottom-0 right-0 w-[50vw] h-[50vw] bg-primary/10 rounded-full blur-[120px]"></div>
            </>
         )}
         
         {(theme !== 'minimal' && theme !== 'studio' && theme !== 'terminal') && (
           <>
            <div className="absolute top-[10%] left-[20%] w-[40vw] h-[40vw] bg-primary/5 rounded-full blur-[120px] opacity-10"></div>
            <div className="absolute bottom-[10%] right-[20%] w-[35vw] h-[35vw] bg-secondary/5 rounded-full blur-[120px] opacity-10"></div>
           </>
         )}
      </div>

      {/* Global Fixed Header */}
      {showNav && (
        <header className="fixed top-0 left-0 right-0 z-[60] h-16 px-4 md:px-8 flex justify-between items-center bg-background/80 backdrop-blur-md border-b border-white/5 pointer-events-none">
          
          {/* Left: Logo */}
          <div 
            className="flex items-center space-x-3 pointer-events-auto cursor-pointer group"
            onClick={() => onNavClick && onNavClick('VAULT')}
          >
            <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-primary shadow-[0_0_10px_var(--primary)] group-hover:scale-110 transition-transform"></div>
            <span className="text-xs md:text-sm font-display font-medium tracking-widest text-text-muted group-hover:text-text-main transition-colors">INIZIO // OS</span>
          </div>
          
          {/* Right: Controls (Mobile Toggle + Desktop) */}
          <div className="pointer-events-auto flex items-center space-x-3 md:space-x-6">
             
             {/* Mobile Toggle */}
             <button 
               className="md:hidden p-2 text-text-muted hover:text-text-main"
               onClick={() => setIsMenuOpen(!isMenuOpen)}
               aria-label="Toggle menu"
             >
               <div className={`w-5 h-0.5 bg-current mb-1.5 transition-transform ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
               <div className={`w-5 h-0.5 bg-current transition-opacity ${isMenuOpen ? 'opacity-0' : ''}`}></div>
               <div className={`w-5 h-0.5 bg-current mt-1.5 transition-transform ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
             </button>

             {/* Desktop Controls */}
             <div className="hidden md:flex items-center space-x-6">
                <button 
                  onClick={() => onNavClick && onNavClick('SETTINGS')}
                  className="text-[10px] md:text-xs font-mono text-text-muted hover:text-primary uppercase tracking-wider flex items-center"
                >
                  <span className="mr-2">System</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-70 hover:opacity-100"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                </button>

                <div 
                  onClick={() => onNavClick && onNavClick('PROFILE')}
                  className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center backdrop-blur-sm hover:bg-surface hover:border-primary/50 transition-colors cursor-pointer relative bg-background/50"
                >
                  <div className="w-2 h-2 bg-primary/50 rounded-full"></div>
                  <div className="absolute inset-0 rounded-full border border-primary animate-ping opacity-20"></div>
                </div>
             </div>
          </div>
        </header>
      )}

      {/* Mobile Menu Dropdown */}
      {showNav && isMenuOpen && (
         <div className="md:hidden fixed top-16 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-white/10 p-4 space-y-4 animate-slide-up shadow-2xl">
            <button onClick={() => { onNavClick?.('VAULT'); setIsMenuOpen(false); }} className="w-full text-left py-3 text-sm text-text-main font-mono uppercase border-b border-white/5">Vault</button>
            <button onClick={() => { onNavClick?.('SETTINGS'); setIsMenuOpen(false); }} className="w-full text-left py-3 text-sm text-text-main font-mono uppercase border-b border-white/5">System Controls</button>
            <button onClick={() => { onNavClick?.('PROFILE'); setIsMenuOpen(false); }} className="w-full text-left py-3 text-sm text-text-main font-mono uppercase">User Profile</button>
         </div>
      )}

      {/* Main Content */}
      <main className="relative z-10 w-full h-[100dvh] flex flex-col pt-0">
        {children}
      </main>
    </div>
  );
};

export default Layout;
