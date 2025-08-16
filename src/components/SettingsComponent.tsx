import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  LogOut, 
  Download, 
  Eye, 
  Image, 
  Video, 
  Music, 
  FileText, 
  Link,
  Settings,
  User,
  Shield,
  Cog,
  Save,
  RefreshCw,
  Palette,
  Monitor,
  Smartphone,
  Globe
} from 'lucide-react';
import settingsService, { AppSettings } from '../services/settingsService';

interface SettingsComponentProps {
  currentUser: any;
  onBack: () => void;
  onLogout: () => void;
}

const SettingsComponent: React.FC<SettingsComponentProps> = ({
  currentUser,
  onBack,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'export' | 'display' | 'advanced'>('profile');
  const [exportSettings, setExportSettings] = useState(settingsService.getExportSettings());
  const [displaySettings, setDisplaySettings] = useState(settingsService.getDisplaySettings());
  const [generalSettings, setGeneralSettings] = useState(settingsService.getGeneralSettings());
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load settings when component mounts
  useEffect(() => {
    setExportSettings(settingsService.getExportSettings());
    setDisplaySettings(settingsService.getDisplaySettings());
    setGeneralSettings(settingsService.getGeneralSettings());
  }, []);

  const handleExportSettingChange = (key: string, value: any) => {
    setExportSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setHasUnsavedChanges(true);
  };

  const handleDisplaySettingChange = (key: string, value: any) => {
    setDisplaySettings(prev => ({
      ...prev,
      [key]: value
    }));
    setHasUnsavedChanges(true);
  };

  const handleGeneralSettingChange = (key: string, value: any) => {
    setGeneralSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setHasUnsavedChanges(true);
  };

  const saveSettings = () => {
    settingsService.updateSettings({
      export: exportSettings,
      display: displaySettings,
      general: generalSettings
    });
    setHasUnsavedChanges(false);
    // Show success message
    alert('Settings saved successfully!');
  };

  const resetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      settingsService.resetToDefaults();
      setExportSettings(settingsService.getExportSettings());
      setDisplaySettings(settingsService.getDisplaySettings());
      setGeneralSettings(settingsService.getGeneralSettings());
      setHasUnsavedChanges(false);
      alert('Settings reset to defaults!');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-discord-darkest">
      {/* Header */}
      <div className="bg-discord-dark border-b border-discord-lighter p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 rounded-lg hover:bg-discord-light transition-colors text-discord-textMuted hover:text-discord-text"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <div className="flex items-center space-x-3">
              <Settings className="w-6 h-6 text-discord-primary" />
              <h2 className="text-xl font-semibold text-discord-text">Settings</h2>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={saveSettings}
              className="discord-button text-sm px-4 py-2 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
            <button
              onClick={resetSettings}
              className="discord-button-secondary text-sm px-4 py-2 flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="w-64 bg-discord-dark border-r border-discord-lighter">
          <div className="p-4 space-y-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                activeTab === 'profile' ? 'bg-discord-primary text-white' : 'text-discord-text hover:bg-discord-light'
              }`}
            >
              <User className="w-5 h-5" />
              <span>Profile</span>
            </button>
            
            <button
              onClick={() => setActiveTab('export')}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                activeTab === 'export' ? 'bg-discord-primary text-white' : 'text-discord-text hover:bg-discord-light'
              }`}
            >
              <Download className="w-5 h-5" />
              <span>Export Options</span>
            </button>
            
            <button
              onClick={() => setActiveTab('display')}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                activeTab === 'display' ? 'bg-discord-primary text-white' : 'text-discord-text hover:bg-discord-light'
              }`}
            >
              <Eye className="w-5 h-5" />
              <span>Display</span>
            </button>
            
            <button
              onClick={() => setActiveTab('advanced')}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                activeTab === 'advanced' ? 'bg-discord-primary text-white' : 'text-discord-text hover:bg-discord-light'
              }`}
            >
              <Cog className="w-5 h-5" />
              <span>Advanced</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-discord-text">User Profile</h3>
                
                {currentUser && (
                  <div className="discord-card">
                    <div className="flex items-center space-x-6 mb-6">
                      <img
                        src={currentUser.avatarUrl || 'https://via.placeholder.com/80/40444B/72767D?text=?'}
                        alt={currentUser.username}
                        className="w-20 h-20 rounded-full"
                      />
                      <div>
                        <h4 className="text-xl font-semibold text-discord-text">{currentUser.displayName}</h4>
                        <p className="text-discord-textMuted">#{currentUser.discriminator}</p>
                        <p className="text-sm text-discord-textMuted">
                          {currentUser.isBot ? 'Bot Account' : 'User Account'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-discord-text mb-2">Username</label>
                        <input
                          type="text"
                          value={currentUser.username}
                          disabled
                          className="discord-input w-full bg-discord-light"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-discord-text mb-2">Global Name</label>
                        <input
                          type="text"
                          value={currentUser.globalName || 'Not set'}
                          disabled
                          className="discord-input w-full bg-discord-light"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-discord-lighter">
                      <button
                        onClick={onLogout}
                        className="discord-button-secondary text-discord-danger hover:bg-discord-danger hover:text-white"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'export' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-discord-text">Export Options</h3>
                
                <div className="discord-card">
                  <h4 className="text-lg font-semibold text-discord-text mb-4">Default Export Settings</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-discord-text mb-2">Export Format</label>
                      <select
                        value={exportSettings.defaultFormat}
                        onChange={(e) => handleExportSettingChange('defaultFormat', e.target.value)}
                        className="discord-input w-full"
                      >
                        <option value="Json">JSON</option>
                        <option value="Html">HTML</option>
                        <option value="Csv">CSV</option>
                        <option value="Txt">Plain Text</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-discord-text mb-2">Message Limit</label>
                      <input
                        type="number"
                        value={exportSettings.defaultMessageLimit}
                        onChange={(e) => handleExportSettingChange('defaultMessageLimit', parseInt(e.target.value))}
                        min="100"
                        max="10000"
                        className="discord-input w-full"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-4">
                    <h5 className="font-medium text-discord-text">Content Options</h5>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={exportSettings.includeMedia}
                          onChange={(e) => handleExportSettingChange('includeMedia', e.target.checked)}
                          className="rounded border-discord-lighter text-discord-primary focus:ring-discord-primary"
                        />
                        <Image className="w-5 h-5 text-discord-textMuted" />
                        <span className="text-discord-text">Include media files</span>
                      </label>
                      
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={exportSettings.includeEmbeds}
                          onChange={(e) => handleExportSettingChange('includeEmbeds', e.target.checked)}
                          className="rounded border-discord-lighter text-discord-primary focus:ring-discord-primary"
                        />
                        <Link className="w-5 h-5 text-discord-textMuted" />
                        <span className="text-discord-text">Include embeds</span>
                      </label>
                      
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={exportSettings.includeReactions}
                          onChange={(e) => handleExportSettingChange('includeReactions', e.target.checked)}
                          className="rounded border-discord-lighter text-discord-primary focus:ring-discord-primary"
                        />
                        <span className="text-discord-text">Include reactions</span>
                      </label>
                      
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={exportSettings.reuseMedia}
                          onChange={(e) => handleExportSettingChange('reuseMedia', e.target.checked)}
                          className="rounded border-discord-lighter text-discord-primary focus:ring-discord-primary"
                        />
                        <span className="text-discord-text">Reuse media files</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'display' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-discord-text">Display Settings</h3>
                
                <div className="discord-card">
                  <h4 className="text-lg font-semibold text-discord-text mb-4">Content Display</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={displaySettings.showImages}
                          onChange={(e) => handleDisplaySettingChange('showImages', e.target.checked)}
                          className="rounded border-discord-lighter text-discord-primary focus:ring-discord-primary"
                        />
                        <Image className="w-5 h-5 text-discord-textMuted" />
                        <span className="text-discord-text">Show images</span>
                      </label>
                      
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={displaySettings.showVideos}
                          onChange={(e) => handleDisplaySettingChange('showVideos', e.target.checked)}
                          className="rounded border-discord-lighter text-discord-primary focus:ring-discord-primary"
                        />
                        <Video className="w-5 h-5 text-discord-textMuted" />
                        <span className="text-discord-text">Show videos</span>
                      </label>
                      
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={displaySettings.showEmbeds}
                          onChange={(e) => handleDisplaySettingChange('showEmbeds', e.target.checked)}
                          className="rounded border-discord-lighter text-discord-primary focus:ring-discord-primary"
                        />
                        <Link className="w-5 h-5 text-discord-textMuted" />
                        <span className="text-discord-text">Show embeds</span>
                      </label>
                    </div>
                    
                    <div className="space-y-4">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={displaySettings.showReactions}
                          onChange={(e) => handleDisplaySettingChange('showReactions', e.target.checked)}
                          className="rounded border-discord-lighter text-discord-primary focus:ring-discord-primary"
                        />
                        <span className="text-discord-text">Show reactions</span>
                      </label>
                      
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={displaySettings.showTimestamps}
                          onChange={(e) => handleDisplaySettingChange('showTimestamps', e.target.checked)}
                          className="rounded border-discord-lighter text-discord-primary focus:ring-discord-primary"
                        />
                        <span className="text-discord-text">Show timestamps</span>
                      </label>
                      
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={displaySettings.showUserAvatars}
                          onChange={(e) => handleDisplaySettingChange('showUserAvatars', e.target.checked)}
                          className="rounded border-discord-lighter text-discord-primary focus:ring-discord-primary"
                        />
                        <User className="w-5 h-5 text-discord-textMuted" />
                        <span className="text-discord-text">Show user avatars</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-discord-lighter">
                    <h5 className="font-medium text-discord-text mb-4">Interface</h5>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-discord-text mb-2">Theme</label>
                        <select
                          value={displaySettings.theme}
                          onChange={(e) => handleDisplaySettingChange('theme', e.target.value)}
                          className="discord-input w-full"
                        >
                          <option value="dark">Dark</option>
                          <option value="light">Light</option>
                          <option value="auto">Auto</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-discord-text mb-2">Font Size</label>
                        <select
                          value={displaySettings.fontSize}
                          onChange={(e) => handleDisplaySettingChange('fontSize', e.target.value)}
                          className="discord-input w-full"
                        >
                          <option value="small">Small</option>
                          <option value="medium">Medium</option>
                          <option value="large">Large</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'advanced' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-discord-text">Advanced Settings</h3>
                
                <div className="discord-card">
                  <h4 className="text-lg font-semibold text-discord-text mb-4">System</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-discord-text mb-2">Date Format</label>
                      <select
                        value={exportSettings.dateFormat}
                        onChange={(e) => handleExportSettingChange('dateFormat', e.target.value)}
                        className="discord-input w-full"
                      >
                        <option value="relative">Relative (e.g., 2 hours ago)</option>
                        <option value="absolute">Absolute (e.g., 2024-01-15 14:30)</option>
                        <option value="iso">ISO 8601</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-discord-text mb-2">Timezone</label>
                      <select
                        value={exportSettings.timezone}
                        onChange={(e) => handleExportSettingChange('timezone', e.target.value)}
                        className="discord-input w-full"
                      >
                        <option value="UTC">UTC</option>
                        <option value="local">Local Time</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-discord-lighter">
                    <h5 className="font-medium text-discord-text mb-4">Performance</h5>
                    
                    <div className="space-y-4">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={displaySettings.compactMode}
                          onChange={(e) => handleDisplaySettingChange('compactMode', e.target.checked)}
                          className="rounded border-discord-lighter text-discord-primary focus:ring-discord-primary"
                        />
                        <span className="text-discord-text">Compact mode (faster loading)</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsComponent;
