export interface AppSettings {
  export: {
    defaultFormat: 'Json' | 'html' | 'txt';
    defaultMessageLimit: number;
    includeMedia: boolean;
    includeEmbeds: boolean;
    includeReactions: boolean;
    includeThreads: string;
    reuseMedia: boolean;
    markdown: boolean;
    dateFormat: string;
    timezone: string;
  };
  display: {
    theme: 'dark' | 'light';
    fontSize: 'small' | 'medium' | 'large';
    showImages: boolean;
    showVideos: boolean;
    showEmbeds: boolean;
    showReactions: boolean;
    showTimestamps: boolean;
    showUserAvatars: boolean;
    showBotBadges: boolean;
    compactMode: boolean;
  };
  general: {
    autoSave: boolean;
    notifications: boolean;
    language: string;
  };
}

const defaultSettings: AppSettings = {
  export: {
    defaultFormat: 'Json',
    defaultMessageLimit: 1000,
    includeMedia: true,
    includeEmbeds: true,
    includeReactions: true,
    includeThreads: 'All',
    reuseMedia: true,
    markdown: false,
    dateFormat: 'relative',
    timezone: 'UTC',
  },
  display: {
    theme: 'dark',
    fontSize: 'medium',
    showImages: true,
    showVideos: true,
    showEmbeds: true,
    showReactions: true,
    showTimestamps: true,
    showUserAvatars: true,
    showBotBadges: true,
    compactMode: false,
  },
  general: {
    autoSave: true,
    notifications: true,
    language: 'en',
  },
};

class SettingsService {
  private settings: AppSettings;
  private readonly STORAGE_KEY = 'discord_chat_exporter_settings';

  constructor() {
    this.settings = this.loadSettings();
  }

  private loadSettings(): AppSettings {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with defaults to ensure all properties exist
        return this.mergeWithDefaults(parsed);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
    return { ...defaultSettings };
  }

  private mergeWithDefaults(stored: Partial<AppSettings>): AppSettings {
    const merged = { ...defaultSettings };
    
    // Deep merge stored settings with defaults
    if (stored.export) {
      merged.export = { ...merged.export, ...stored.export };
    }
    if (stored.display) {
      merged.display = { ...merged.display, ...stored.display };
    }
    if (stored.general) {
      merged.general = { ...merged.general, ...stored.general };
    }
    
    return merged;
  }

  private saveSettings(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }

  // Get all settings
  getSettings(): AppSettings {
    return { ...this.settings };
  }

  // Get specific setting category
  getExportSettings() {
    return { ...this.settings.export };
  }

  getDisplaySettings() {
    return { ...this.settings.display };
  }

  getGeneralSettings() {
    return { ...this.settings.general };
  }

  // Update specific setting
  updateSetting<K extends keyof AppSettings, SK extends keyof AppSettings[K]>(
    category: K,
    key: SK,
    value: AppSettings[K][SK]
  ): void {
    this.settings[category][key] = value;
    this.saveSettings();
  }

  // Update multiple settings at once
  updateSettings(updates: Partial<AppSettings>): void {
    this.settings = { ...this.settings, ...updates };
    this.saveSettings();
  }

  // Reset to defaults
  resetToDefaults(): void {
    this.settings = { ...defaultSettings };
    this.saveSettings();
  }

  // Get a specific setting value
  getSetting<K extends keyof AppSettings, SK extends keyof AppSettings[K]>(
    category: K,
    key: SK
  ): AppSettings[K][SK] {
    return this.settings[category][key];
  }

  // Check if a setting is enabled
  isEnabled<K extends keyof AppSettings, SK extends keyof AppSettings[K]>(
    category: K,
    key: SK
  ): boolean {
    const value = this.settings[category][key];
    return typeof value === 'boolean' ? value : false;
  }
}

export const settingsService = new SettingsService();
export default settingsService;
