
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';
import { ArrowRight, Fingerprint, Loader2, AlertCircle } from 'lucide-react';
import LandingPage from './LandingPage';
import { useAuth } from '../../contexts/AuthContext';

interface Props {
  onComplete: () => void;
}

type Step = 'LANDING' | 'LOGIN' | 'ARCHETYPE' | 'MISSION' | 'READY';

const Login: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState<Step>('LANDING');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [loginData, setLoginData] = useState({ identifier: '', password: '' });
  const [signupData, setSignupData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isSignupLoading, setIsSignupLoading] = useState(false);

  const { login, signup, initiateGoogleAuth, isAuthenticated } = useAuth();

  // Check for OAuth callback on mount
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('success')) {
      setSuccess('Successfully authenticated with Google!');
      setStep('ARCHETYPE');
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (urlParams.has('error')) {
      setError('Authentication failed. Please try again.');
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Auto-advance if already authenticated
  React.useEffect(() => {
    if (isAuthenticated && step === 'LANDING') {
      setStep('READY');
    }
  }, [isAuthenticated, step]);

  const handleStart = () => setStep('LOGIN');

  const handleGoogleAuth = async () => {
    try {
      setIsGoogleLoading(true);
      setError(null);
      setSuccess(null);
      initiateGoogleAuth();
      // Note: The OAuth flow will redirect the user to Google, so this component might unmount
    } catch (err) {
      console.error('Google auth error:', err);
      setError('Failed to initiate Google authentication');
      setIsGoogleLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.identifier || !loginData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setIsLoginLoading(true);
      setError(null);
      await login(loginData);
      setStep('ARCHETYPE');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupData.username || !signupData.email || !signupData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setIsSignupLoading(true);
      setError(null);
      await signup(signupData);
      setError('Account created! Please check your email to verify your account.');
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setIsSignupLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 'ARCHETYPE') setStep('MISSION');
    else if (step === 'MISSION') setStep('READY');
    else if (step === 'READY') onComplete();
  };

  // If on LANDING step, render the full landing page component
  if (step === 'LANDING') {
    return (
      <div className="absolute inset-0 z-50 bg-[#0A0A0C]">
        <LandingPage onEnter={handleStart} />
      </div>
    );
  }

  // For other steps, use the centered modal layout
  return (
    <div className="h-full w-full flex items-center justify-center relative overflow-hidden px-4 md:px-6 bg-black">
      
      {/* Ambient Background for Login Flow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-primary/5 rounded-full blur-[80px] md:blur-[100px] animate-pulse"></div>
        {/* Galaxy Stardust */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.2] mix-blend-screen animate-pulse-slow"></div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* LOGIN FORM */}
        {step === 'LOGIN' && (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative z-10 w-full max-w-md p-6 md:p-8 glass-panel rounded-2xl border border-white/10 shadow-2xl"
          >
             <button onClick={() => setStep('LANDING')} className="text-xs text-text-muted hover:text-white mb-6 font-mono tracking-widest uppercase">
               ← Back
             </button>

             <div className="text-center mb-8">
               <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10 shadow-[0_0_15px_rgba(46,199,255,0.1)]">
                 <Fingerprint className="text-primary" size={24} />
               </div>
               <h2 className="text-2xl font-display font-bold text-white">Identify</h2>
               <p className="text-text-muted text-sm mt-2">Access your founder vault.</p>
             </div>

             <form onSubmit={handleLogin} className="space-y-4">
               <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-text-dim font-mono">Email or Username</label>
                  <input
                    type="text"
                    value={loginData.identifier}
                    onChange={(e) => setLoginData(prev => ({ ...prev, identifier: e.target.value }))}
                    className="w-full bg-[#0A0A0C] border border-white/10 rounded p-3 text-white focus:border-primary/50 outline-none transition-all hover:border-white/20 placeholder:text-white/10"
                    placeholder="founder@startup.com or username"
                    required
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-text-dim font-mono">Passcode</label>
                  <input
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full bg-[#0A0A0C] border border-white/10 rounded p-3 text-white focus:border-primary/50 outline-none transition-all hover:border-white/20 placeholder:text-white/10"
                    placeholder="••••••••"
                    required
                  />
               </div>

               {error && (
                 <div className="flex items-center space-x-2 text-red-400 text-sm">
                   <AlertCircle size={16} />
                   <span>{error}</span>
                 </div>
               )}

               {success && (
                 <div className="flex items-center space-x-2 text-green-400 text-sm">
                   <span>✓ {success}</span>
                 </div>
               )}

               <Button
                variant="primary"
                className="w-full mt-4 group"
                type="submit"
                disabled={isLoginLoading}
               >
                 {isLoginLoading ? (
                   <>
                     <Loader2 size={16} className="animate-spin mr-2" />
                     Authenticating...
                   </>
                 ) : (
                   <>
                     Authenticate <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                   </>
                 )}
               </Button>
             </form>

             <div className="pt-4 text-center border-t border-white/5 mt-4">
               <button
                  onClick={handleGoogleAuth}
                  className="w-full py-2.5 rounded border border-white/10 bg-white/5 hover:bg-white/10 text-xs text-white font-medium flex items-center justify-center transition-colors hover:border-white/30 hover:text-primary"
                  disabled={isGoogleLoading}
               >
                  {isGoogleLoading ? (
                      <div className="flex items-center">
                         <Loader2 size={16} className="animate-spin mr-2 text-primary" />
                         <span className="animate-pulse">Handshaking Google...</span>
                      </div>
                  ) : (
                      <div className="flex items-center">
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4 mr-2" alt="Google" />
                        <span>Initialize via Google</span>
                      </div>
                  )}
               </button>
             </div>
          </motion.div>
        )}

        {step === 'ARCHETYPE' && (
           <QuestionStep 
             key="archetype"
             question="What kind of builder are you?"
             options={['Solo Hacker', 'Visionary', 'Technical Founder', 'Creative Director']}
             onSelect={nextStep}
           />
        )}

        {step === 'MISSION' && (
           <QuestionStep 
             key="mission"
             question="What is the primary objective?"
             options={['Financial Freedom', 'Legacy', 'Creative Expression', 'Solving Pain']}
             onSelect={nextStep}
           />
        )}

        {step === 'READY' && (
          <motion.div
            key="ready"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center px-4"
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Workspace Ready.</h1>
            <p className="text-primary font-mono text-xs md:text-sm mb-8 tracking-widest uppercase animate-pulse">Initializing Co-Founder AI...</p>
            <Button variant="glass" size="lg" onClick={nextStep} className="w-full md:w-auto">
              Enter Vault
            </Button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

const QuestionStep = ({ question, options, onSelect }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="w-full max-w-2xl text-center px-4"
  >
    <h2 className="text-2xl md:text-3xl font-display text-white mb-8 md:mb-12">{question}</h2>
    <div className="flex flex-wrap justify-center gap-4">
      {options.map((opt: string) => (
        <button
          key={opt}
          onClick={onSelect}
          className="px-6 py-3 md:px-8 md:py-4 rounded-full border border-white/10 bg-white/5 hover:bg-primary/10 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(46,199,255,0.2)] transition-all text-sm md:text-lg font-light text-white"
        >
          {opt}
        </button>
      ))}
    </div>
  </motion.div>
);

export default Login;
