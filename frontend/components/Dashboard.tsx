import React from 'react';
import { MOCK_PROJECTS } from '../constants';
import Card from './ui/Card';
import { Project } from '../types';
import { ArrowUpRight, MoreHorizontal, TrendingUp, Clock } from 'lucide-react';

interface DashboardProps {
  onProjectSelect: (project: Project) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onProjectSelect }) => {
  return (
    <div className="space-y-8 animate-slide-up">
      {/* Hero Section */}
      <section className="relative rounded-2xl overflow-hidden p-8 md:p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/5 z-0"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 z-0 mix-blend-overlay"></div>
        
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            From idea to investor-ready <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">in a weekend.</span>
          </h1>
          <p className="text-lg text-text-muted mb-8 max-w-xl">
            Inizio turns fuzzy concepts into validated blueprints. Start an experiment, build your waitlist, and generate your pitch deck.
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Your Studio</h2>
          <button className="text-sm text-primary hover:text-primary/80 font-medium flex items-center">
            View all <ArrowUpRight size={16} className="ml-1" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_PROJECTS.map((project) => (
            <Card 
              key={project.id} 
              onClick={() => onProjectSelect(project)} 
              hoverEffect 
              className="group relative min-h-[220px] flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${
                    project.stage === 'Validation' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                    project.stage === 'Build' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                    'bg-blue-500/10 text-blue-500 border-blue-500/20'
                  }`}>
                    {project.stage}
                  </span>
                  <button className="text-text-muted hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal size={18} />
                  </button>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{project.name}</h3>
                <p className="text-sm text-text-muted line-clamp-2">{project.pitch}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-text-muted font-mono">
                <div className="flex items-center space-x-1">
                  <Clock size={12} />
                  <span>{project.lastEdited}</span>
                </div>
                {project.validationScore > 0 && (
                  <div className="flex items-center space-x-1 text-primary">
                     <TrendingUp size={12} />
                     <span>Score: {project.validationScore}</span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Quick Insights Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-start space-x-4">
          <div className="bg-primary/20 p-2 rounded-full text-primary mt-1">
            <TrendingUp size={16} />
          </div>
          <div>
            <p className="text-white font-medium text-sm">Waitlist converting at 8%</p>
            <p className="text-xs text-text-muted mt-1">Top 10% for your category. Suggest implementing pre-sale checkout.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;