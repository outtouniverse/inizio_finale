

import { Project, UserProfile, AppSettings, AgentStep } from '../types';
import { MOCK_PROJECTS, MOCK_PROFILE } from '../constants';

const KEYS = {
  PROJECTS: 'inizio_projects',
  PROFILE: 'inizio_profile',
  SETTINGS: 'inizio_settings'
};

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'cyberwave',
  aiPersonality: {
    creativity: 80,
    risk: 40,
    verbosity: 20,
    archetype: 'Strategic'
  },
  privacyMode: false,
  soundEnabled: true
};

export const StorageService = {
  getProjects: (): Project[] => {
    try {
      const stored = localStorage.getItem(KEYS.PROJECTS);
      return stored ? JSON.parse(stored) : MOCK_PROJECTS;
    } catch (e) {
      return MOCK_PROJECTS;
    }
  },

  getProjectById: (id: string): Project | undefined => {
    const projects = StorageService.getProjects();
    return projects.find(p => p.id === id);
  },

  saveProject: (project: Project): Project[] => {
    const projects = StorageService.getProjects();
    const existingIndex = projects.findIndex(p => p.id === project.id);
    
    let updatedProjects;
    if (existingIndex >= 0) {
      // Merge existing artifacts if the new object doesn't have them populated
      const existing = projects[existingIndex];
      updatedProjects = [...projects];
      updatedProjects[existingIndex] = {
        ...project,
        artifacts: project.artifacts || existing.artifacts 
      };
    } else {
      updatedProjects = [project, ...projects];
    }
    
    localStorage.setItem(KEYS.PROJECTS, JSON.stringify(updatedProjects));
    return updatedProjects;
  },

  // New method to save a specific step result
  saveArtifact: (projectId: string, step: AgentStep, data: any) => {
    const projects = StorageService.getProjects();
    const index = projects.findIndex(p => p.id === projectId);

    if (index >= 0) {
      const project = projects[index];
      if (!project.artifacts) {
        project.artifacts = {};
      }
      
      // Save data to the specific step key
      project.artifacts[step] = data;
      
      // If it's a score, let's also update the top level validation score
      if (step === 'SCORE' && data.total) {
        project.validationScore = data.total;
        if (data.total > 70) project.stage = 'Validation';
      }
      
      // Update timestamp
      project.lastEdited = 'Just now';

      projects[index] = project;
      localStorage.setItem(KEYS.PROJECTS, JSON.stringify(projects));
    }
  },

  getProfile: (): UserProfile => {
    try {
      const stored = localStorage.getItem(KEYS.PROFILE);
      return stored ? JSON.parse(stored) : MOCK_PROFILE;
    } catch (e) {
      return MOCK_PROFILE;
    }
  },

  saveProfile: (profile: UserProfile) => {
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
  },

  getSettings: (): AppSettings => {
    try {
      const stored = localStorage.getItem(KEYS.SETTINGS);
      return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings: (settings: AppSettings) => {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  }
};