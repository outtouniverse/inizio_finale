

import { Project, UserProfile, AppSettings, AgentStep } from '../types';
import { MOCK_PROJECTS, MOCK_PROFILE } from '../constants';
import { authService } from './authService';
import { settingsService } from './settingsService';
import { projectService } from './projectService';

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

  getProfile: async (): Promise<UserProfile> => {
    try {
      return await settingsService.getProfile();
    } catch (e) {
      console.warn('Error fetching profile from backend:', e);
      // Fallback to cached or mock profile
      const cached = settingsService.getCachedProfile();
      return cached || MOCK_PROFILE;
    }
  },

  saveProfile: async (profile: UserProfile): Promise<void> => {
    try {
      // Only update the fields that can be changed via profile update
      await settingsService.updateProfile({
        archetype: profile.archetype,
        mission: profile.mission,
        traits: profile.traits,
        profilePicture: profile.profilePicture
      });
    } catch (e) {
      console.warn('Error saving profile to backend:', e);
      // Could implement local fallback here if needed
    }
  },

  getSettings: async (): Promise<AppSettings> => {
    try {
      return await settingsService.getSettings();
    } catch (e) {
      console.warn('Error fetching settings from backend:', e);
      // Fallback to cached or default settings
      const cached = settingsService.getCachedSettings();
      return cached || DEFAULT_SETTINGS;
    }
  },

  saveSettings: async (settings: AppSettings): Promise<void> => {
    try {
      await settingsService.updateSettings(settings);
    } catch (e) {
      console.warn('Error saving settings to backend:', e);
      // Could implement local fallback here if needed
    }
  },

  // Sync profile data with backend
  syncProfileToBackend: async (profile: UserProfile) => {
    try {
      await authService.updateProfile({
        archetype: profile.archetype,
        mission: profile.mission,
        traits: profile.traits
      });
    } catch (error) {
      console.warn('Failed to sync profile to backend:', error);
      throw error;
    }
  },

  // Get profile from backend (now the primary method)
  getProfileFromBackend: async (): Promise<UserProfile> => {
    return await StorageService.getProfile();
  }
};