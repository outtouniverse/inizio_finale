import { AppSettings, UserProfile } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export interface BackendUserProfile {
  id: string;
  username: string;
  email: string;
  emailVerified: boolean;
  role: string;
  profilePicture?: string;
  archetype: string;
  level: number;
  mission: string;
  badges: string[];
  traits: Array<{
    name: string;
    score: number;
  }>;
  buildStreak: number;
  activityCount: number;
  lastActivity?: Date;
}

export interface BackendSettings extends AppSettings {
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class SettingsService {
  private settingsCache: AppSettings | null = null;
  private profileCache: UserProfile | null = null;
  private cacheExpiry: number = 0;
  private readonly CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

  // Settings methods
  async getSettings(): Promise<AppSettings> {
    try {
      const response = await fetch(`${API_BASE}/settings`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch settings');
      }

      // Cache the result
      this.settingsCache = result.data;
      this.cacheExpiry = Date.now() + this.CACHE_DURATION;

      return result.data;
    } catch (error) {
      console.error('Error fetching settings:', error);
      // Return default settings on error
      return {
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
    }
  }

  async updateSettings(settings: Partial<AppSettings>): Promise<AppSettings> {
    try {
      const response = await fetch(`${API_BASE}/settings`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to update settings');
      }

      // Update cache
      this.settingsCache = result.data;
      this.cacheExpiry = Date.now() + this.CACHE_DURATION;

      return result.data;
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  }

  async resetSettings(): Promise<AppSettings> {
    try {
      const response = await fetch(`${API_BASE}/settings/reset`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to reset settings');
      }

      // Update cache
      this.settingsCache = result.data;
      this.cacheExpiry = Date.now() + this.CACHE_DURATION;

      return result.data;
    } catch (error) {
      console.error('Error resetting settings:', error);
      throw error;
    }
  }

  // Profile methods
  async getProfile(): Promise<UserProfile> {
    try {
      const response = await fetch(`${API_BASE}/users/profile`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch profile');
      }

      const backendProfile: BackendUserProfile = result.data.user;

      // Convert backend format to frontend format
      const frontendProfile: UserProfile = {
        name: backendProfile.username,
        archetype: backendProfile.archetype,
        level: backendProfile.level,
        mission: backendProfile.mission,
        badges: backendProfile.badges,
        traits: backendProfile.traits,
        profilePicture: backendProfile.profilePicture
      };

      // Cache the result
      this.profileCache = frontendProfile;
      this.cacheExpiry = Date.now() + this.CACHE_DURATION;

      return frontendProfile;
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Return default profile on error
      return {
        name: 'Founder',
        archetype: 'Visionary Architect',
        level: 1,
        mission: 'Building the future.',
        badges: ['First Steps'],
        traits: [
          { name: 'Vision', score: 80 },
          { name: 'Execution', score: 65 },
          { name: 'Resilience', score: 75 }
        ]
      };
    }
  }

  async updateProfile(profileData: Partial<{
    username: string;
    email: string;
    archetype: string;
    mission: string;
    traits: Array<{ name: string; score: number }>;
    profilePicture?: string;
  }>): Promise<UserProfile> {
    try {
      const response = await fetch(`${API_BASE}/users/profile`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to update profile');
      }

      const backendProfile: BackendUserProfile = result.data.user;

      // Convert backend format to frontend format
      const frontendProfile: UserProfile = {
        name: backendProfile.username,
        archetype: backendProfile.archetype,
        level: backendProfile.level,
        mission: backendProfile.mission,
        badges: backendProfile.badges,
        traits: backendProfile.traits,
        profilePicture: backendProfile.profilePicture
      };

      // Update cache
      this.profileCache = frontendProfile;
      this.cacheExpiry = Date.now() + this.CACHE_DURATION;

      return frontendProfile;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  // Cache management
  clearCache(): void {
    this.settingsCache = null;
    this.profileCache = null;
    this.cacheExpiry = 0;
  }

  // Get cached data if available and not expired
  getCachedSettings(): AppSettings | null {
    if (this.settingsCache && Date.now() < this.cacheExpiry) {
      return this.settingsCache;
    }
    return null;
  }

  getCachedProfile(): UserProfile | null {
    if (this.profileCache && Date.now() < this.cacheExpiry) {
      return this.profileCache;
    }
    return null;
  }
}

export const settingsService = new SettingsService();
