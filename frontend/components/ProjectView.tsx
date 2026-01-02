import React, { useState } from 'react';
import { Project, ProjectTab } from '../types';
import { ArrowLeft, Share2, Layout, TestTube, Hammer, Users, BarChart } from 'lucide-react';
import Button from './ui/Button';
import IdeaCanvas from './IdeaCanvas';
import ValidationEngine from './ValidationEngine';
import BuildKit from './BuildKit';

interface ProjectViewProps {
  project: Project;
  onBack: () => void;
}

const ProjectView: React.FC<ProjectViewProps> = ({ project, onBack }) => {
  const [activeTab, setActiveTab] = useState<ProjectTab>(ProjectTab.CANVAS);

  const TabButton = ({ tab, icon: Icon, label }: any) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        activeTab === tab 
          ? 'bg-white/10 text-white shadow-sm' 
          : 'text-text-muted hover:text-white hover:bg-white/5'
      }`}
    >
      <Icon size={16} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Top Navigation within Project */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-lg text-text-muted transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center">
              {project.name}
              <span className="ml-3 text-xs font-mono font-normal text-primary border border-primary/20 bg-primary/10 px-2 py-0.5 rounded">
                {project.stage}
              </span>
            </h1>
            <p className="text-sm text-text-muted hidden md:block">{project.pitch}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
           <div className="hidden md:flex -space-x-2">
             <div className="w-8 h-8 rounded-full bg-red-500 border-2 border-[#0F1113]"></div>
             <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-[#0F1113]"></div>
             <div className="w-8 h-8 rounded-full bg-white/10 border-2 border-[#0F1113] flex items-center justify-center text-xs">+1</div>
           </div>
           <Button variant="secondary" size="sm">
             <Share2 size={16} className="mr-2" /> Share
           </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto pb-2 mb-6 space-x-1 border-b border-white/5">
        <TabButton tab={ProjectTab.CANVAS} icon={Layout} label="Idea Canvas" />
        <TabButton tab={ProjectTab.VALIDATION} icon={TestTube} label="Validation" />
        <TabButton tab={ProjectTab.BUILD_KIT} icon={Hammer} label="Build Kit" />
        <TabButton tab={ProjectTab.TEAM} icon={Users} label="Team" />
        <TabButton tab={ProjectTab.ANALYTICS} icon={BarChart} label="Analytics" />
      </div>

      {/* Content Area */}
      <div className="flex-1 min-h-0">
        {activeTab === ProjectTab.CANVAS && <IdeaCanvas />}
        {activeTab === ProjectTab.VALIDATION && <ValidationEngine />}
        {activeTab === ProjectTab.BUILD_KIT && <BuildKit />}
        {(activeTab === ProjectTab.TEAM || activeTab === ProjectTab.ANALYTICS) && (
          <div className="flex flex-col items-center justify-center h-full text-text-muted">
            <div className="p-4 bg-white/5 rounded-full mb-4">
               <Hammer size={32} className="opacity-50" />
            </div>
            <p>Module under construction for demo.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectView;