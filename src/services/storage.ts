/**
 * Local Storage Service
 * Manages API key and app settings in localStorage
 */

const STORAGE_KEYS = {
  API_KEY: 'gemini_api_key',
  USAGE_STATS: 'usage_stats',
  SETTINGS: 'app_settings',
} as const;

export interface UsageStats {
  totalGenerations: number;
  totalImages: number;
  lastUsed: string;
}

export interface AppSettings {
  theme: 'light' | 'dark';
  defaultImageCount: number;
}

// Simple encryption (NOT cryptographically secure, just obfuscation)
function simpleEncrypt(text: string): string {
  return btoa(text.split('').reverse().join(''));
}

function simpleDecrypt(encrypted: string): string {
  return atob(encrypted).split('').reverse().join('');
}

export const storage = {
  // API Key Management
  saveApiKey(apiKey: string): void {
    try {
      const encrypted = simpleEncrypt(apiKey);
      localStorage.setItem(STORAGE_KEYS.API_KEY, encrypted);
    } catch (error) {
      console.error('Failed to save API key:', error);
      throw new Error('Failed to save API key');
    }
  },

  getApiKey(): string | null {
    try {
      const encrypted = localStorage.getItem(STORAGE_KEYS.API_KEY);
      if (!encrypted) return null;
      return simpleDecrypt(encrypted);
    } catch (error) {
      console.error('Failed to get API key:', error);
      return null;
    }
  },

  clearApiKey(): void {
    localStorage.removeItem(STORAGE_KEYS.API_KEY);
  },

  // Usage Stats
  getUsageStats(): UsageStats {
    try {
      const stats = localStorage.getItem(STORAGE_KEYS.USAGE_STATS);
      if (!stats) {
        return {
          totalGenerations: 0,
          totalImages: 0,
          lastUsed: new Date().toISOString(),
        };
      }
      return JSON.parse(stats);
    } catch (error) {
      console.error('Failed to get usage stats:', error);
      return {
        totalGenerations: 0,
        totalImages: 0,
        lastUsed: new Date().toISOString(),
      };
    }
  },

  updateUsageStats(imagesGenerated: number): void {
    try {
      const stats = this.getUsageStats();
      const updated: UsageStats = {
        totalGenerations: stats.totalGenerations + 1,
        totalImages: stats.totalImages + imagesGenerated,
        lastUsed: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEYS.USAGE_STATS, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to update usage stats:', error);
    }
  },

  // Settings
  getSettings(): AppSettings {
    try {
      const settings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!settings) {
        return {
          theme: 'light',
          defaultImageCount: 4,
        };
      }
      return JSON.parse(settings);
    } catch (error) {
      console.error('Failed to get settings:', error);
      return {
        theme: 'light',
        defaultImageCount: 4,
      };
    }
  },

  saveSettings(settings: AppSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  },

  // Clear all data
  clearAll(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  },
};
