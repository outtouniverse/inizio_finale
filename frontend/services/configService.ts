const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export interface AIConfig {
  geminiApiKeyConfigured: boolean;
  geminiApiKeyLength: number;
}

class ConfigService {
  private configCache: AIConfig | null = null;
  private cacheExpiry: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  async getAIConfig(): Promise<AIConfig> {
    // Check if we have valid cached data
    if (this.configCache && Date.now() < this.cacheExpiry) {
      return this.configCache;
    }

    try {
      const response = await fetch(`${API_BASE}/ai/config`, {
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
        throw new Error(result.message || 'Failed to fetch AI config');
      }

      // Cache the result
      this.configCache = result.data;
      this.cacheExpiry = Date.now() + this.CACHE_DURATION;

      return result.data;
    } catch (error) {
      console.error('Error fetching AI config:', error);
      // Return default config on error
      return {
        geminiApiKeyConfigured: false,
        geminiApiKeyLength: 0
      };
    }
  }

  // Clear cache when needed (e.g., after login/logout)
  clearCache(): void {
    this.configCache = null;
    this.cacheExpiry = 0;
  }
}

export const configService = new ConfigService();
