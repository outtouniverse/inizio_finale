import React from 'react';
import Card from './ui/Card';
import { Lock, Globe, Wand2 } from 'lucide-react';

const IdeaCanvas: React.FC = () => {
  const Section = ({ title, placeholder, locked = false }: any) => (
    <Card className="h-full min-h-[200px] flex flex-col group relative">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-sm font-medium text-text-muted uppercase tracking-wider">{title}</h4>
        <button className="opacity-0 group-hover:opacity-100 transition-opacity text-primary">
          <Wand2 size={14} />
        </button>
      </div>
      <textarea 
        className="flex-1 bg-transparent border-none resize-none focus:outline-none text-sm text-text-main placeholder:text-text-muted/20"
        placeholder={placeholder}
        disabled={locked}
      />
      {locked && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center rounded-xl">
          <Lock size={20} className="text-text-muted" />
        </div>
      )}
    </Card>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Left Snapshot Column */}
      <div className="w-full lg:w-80 flex flex-col gap-6">
        <Card className="flex-none">
          <div className="flex items-center justify-between mb-4">
             <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20">PRIVATE</span>
             <Globe size={14} className="text-text-muted" />
          </div>
          <div className="mb-4">
             <label className="block text-xs text-text-muted mb-1">Product Name</label>
             <input type="text" defaultValue="NeoSync" className="bg-transparent text-xl font-bold text-white w-full focus:outline-none border-b border-transparent focus:border-primary/50" />
          </div>
          <div className="mb-4">
             <label className="block text-xs text-text-muted mb-1">One-liner</label>
             <textarea className="bg-transparent text-sm text-text-main w-full resize-none h-20 focus:outline-none" defaultValue="AI-powered calendar that negotiates meeting times automatically." />
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs bg-white/5 px-2 py-1 rounded text-text-muted">#SaaS</span>
            <span className="text-xs bg-white/5 px-2 py-1 rounded text-text-muted">#Productivity</span>
            <button className="text-xs bg-white/5 px-2 py-1 rounded text-text-muted hover:text-white">+</button>
          </div>
        </Card>

        <Card className="flex-1 bg-gradient-to-b from-primary/5 to-transparent border-primary/20">
           <h4 className="text-sm font-medium text-white mb-4 flex items-center">
             <Wand2 size={14} className="mr-2 text-primary" /> Studio Assistant
           </h4>
           <div className="space-y-4">
             <div className="bg-black/20 p-3 rounded border border-white/5 text-xs text-text-muted">
               <p className="mb-2">💡 <strong>Suggestion:</strong> Users told us they hate friction. Try a "No Sign-up" demo mode for the calendar sync.</p>
               <button className="text-primary hover:underline">Apply to Solution</button>
             </div>
             <div className="bg-black/20 p-3 rounded border border-white/5 text-xs text-text-muted">
               <p className="mb-2">Competitor <strong>Calendly</strong> has a 4.5/5 rating. Key complaint: "Impersonal feel".</p>
             </div>
           </div>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
        <div className="lg:col-span-1"><Section title="Problem" placeholder="Describe the pain point specifically..." /></div>
        <div className="lg:col-span-1"><Section title="Solution" placeholder="How do you solve it differently?" /></div>
        <div className="lg:col-span-1"><Section title="Key Metrics" placeholder="What implies success?" /></div>
        
        <div className="lg:col-span-1"><Section title="Target Persona" placeholder="Who is desperate for this?" /></div>
        <div className="lg:col-span-1"><Section title="Unique Value" placeholder="Why not Google Calendar?" /></div>
        <div className="lg:col-span-1"><Section title="Channels" placeholder="Where do they hang out?" /></div>
        
        <div className="lg:col-span-3 h-48">
           <Section title="User Journey Map" placeholder="Describe the flow..." locked />
        </div>
      </div>
    </div>
  );
};

export default IdeaCanvas;