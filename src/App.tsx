import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Home, 
  Eye, 
  Download, 
  FileText, 
  Settings 
} from 'lucide-react';
import AuthComponent from './components/AuthComponent';
import BrowseComponent from './components/BrowseComponent';
import PreviewComponent from './components/PreviewComponent';
import ExportComponent from './components/ExportComponent';
import ViewerComponent from './components/ViewerComponent';
import SettingsComponent from './components/SettingsComponent';
import discordService from './services/discordService';
import './App.css';

type AppView = 'auth' | 'main';
type MainView = 'browse' | 'preview' | 'export' | 'viewer' | 'settings';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('auth');
  const [mainView, setMainView] = useState<MainView>('browse');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedGuild, setSelectedGuild] = useState<any>(null);
  const [selectedChannel, setSelectedChannel] = useState<any>(null);
  const [selectedDM, setSelectedDM] = useState<any>(null);
  const [guilds, setGuilds] = useState<any[]>([]);
  const [dmChannels, setDmChannels] = useState<any[]>([]);
  const [channels, setChannels] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  
  const [isLoadingGuilds, setIsLoadingGuilds] = useState(false);
  const [isLoadingDMs, setIsLoadingDMs] = useState(false);
  const [isLoadingChannels, setIsLoadingChannels] = useState(false);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadUserData();
    }
  }, [isAuthenticated]);

  const loadUserData = async () => {
    try {
      setIsLoadingGuilds(true);
      setIsLoadingDMs(true);
      
      const user = await discordService.getCurrentUser();
      setCurrentUser(user);
      
      const guildsData = await discordService.getGuilds();
      setGuilds(guildsData);
      setIsLoadingGuilds(false);
      
      const dmChannelsData = await discordService.getDMChannels();
      setDmChannels(dmChannelsData);
      setIsLoadingDMs(false);
    } catch (error) {
      console.error('Failed to load user data:', error);
      setIsLoadingGuilds(false);
      setIsLoadingDMs(false);
    }
  };

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
    setCurrentView('main');
    setMainView('browse');
  };

  const handleLogout = () => {
    discordService.logout();
    setIsAuthenticated(false);
    setCurrentView('auth');
    setCurrentUser(null);
    setSelectedGuild(null);
    setSelectedChannel(null);
    setSelectedDM(null);
    setGuilds([]);
    setDmChannels([]);
    setChannels([]);
    setMembers([]);
    setIsLoadingGuilds(false);
    setIsLoadingDMs(false);
    setIsLoadingChannels(false);
    setIsLoadingMembers(false);
  };

  const handleGuildSelect = async (guild: any) => {
    setSelectedGuild(guild);
    setSelectedChannel(null);
    setSelectedDM(null);
    
    try {
      setIsLoadingChannels(true);
      setIsLoadingMembers(true);
      
      const channelsData = await discordService.getChannels(guild.id);
      setChannels(channelsData);
      setIsLoadingChannels(false);
      
      const membersData = await discordService.getGuildMembers(guild.id);
      setMembers(membersData);
      setIsLoadingMembers(false);
    } catch (error) {
      console.error('Failed to load guild data:', error);
      setIsLoadingChannels(false);
      setIsLoadingMembers(false);
    }
  };

  const handleChannelSelect = (channel: any) => {
    setSelectedChannel(channel);
    setSelectedDM(null);
    setMainView('preview');
  };

  const handleDMSelect = (dm: any) => {
    setSelectedDM(dm);
    setSelectedGuild(null);
    setSelectedChannel(null);
    setMainView('preview');
  };

  const handleExportFromPreview = () => {
    if (selectedChannel) {
      setMainView('export');
    } else if (selectedDM) {
      setMainView('export');
    }
  };

  const renderMainContent = () => {
    switch (mainView) {
      case 'browse':
        return (
          <BrowseComponent
            guilds={guilds}
            dmChannels={dmChannels}
            selectedGuild={selectedGuild}
            selectedChannel={selectedChannel}
            selectedDM={selectedDM}
            channels={channels}
            members={members}
            isLoadingGuilds={isLoadingGuilds}
            isLoadingDMs={isLoadingDMs}
            isLoadingChannels={isLoadingChannels}
            isLoadingMembers={isLoadingMembers}
            onGuildSelect={handleGuildSelect}
            onChannelSelect={handleChannelSelect}
            onDMSelect={handleDMSelect}
            onExport={() => setMainView('export')}
            onViewer={() => setMainView('viewer')}
            onSettings={() => setMainView('settings')}
          />
        );
      case 'preview':
        return (
          <PreviewComponent
            guild={selectedGuild}
            channel={selectedChannel}
            dm={selectedDM}
            onBack={() => setMainView('browse')}
            onExport={handleExportFromPreview}
            onViewer={() => setMainView('viewer')}
          />
        );
      case 'export':
        return (
          <ExportComponent
            guild={selectedGuild}
            channel={selectedChannel}
            dm={selectedDM}
            onBack={() => setMainView('preview')}
            onComplete={() => setMainView('browse')}
          />
        );
      case 'viewer':
        return (
          <ViewerComponent
            onBack={() => setMainView('browse')}
            onExport={() => setMainView('export')}
          />
        );
      case 'settings':
        return (
          <SettingsComponent
            currentUser={currentUser}
            onBack={() => setMainView('browse')}
            onLogout={handleLogout}
          />
        );
      default:
        return null;
    }
  };

  if (currentView === 'auth') {
    return <AuthComponent onAuthenticated={handleAuthenticated} />;
  }

  return (
    <div className="App h-screen bg-discord-darkest flex">
      {/* Left Sidebar - App Navigation */}
      <div className="w-20 bg-discord-darkest flex flex-col items-center py-4 space-y-4 border-r border-discord-lighter">
        {/* App Logo */}
        <div className="w-12 h-12 bg-discord-primary rounded-full flex items-center justify-center mb-6">
          <Shield className="w-6 h-6 text-white" />
        </div>

        {/* Navigation Icons */}
        <div className="flex flex-col items-center space-y-4">
          <div 
            className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
              mainView === 'browse' ? 'bg-discord-primary' : 'bg-discord-light hover:bg-discord-lighter'
            }`}
            onClick={() => setMainView('browse')}
            title="Browse Servers & DMs"
          >
            <Home className="w-6 h-6 text-white" />
          </div>
          
          <div 
            className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
              mainView === 'preview' ? 'bg-discord-primary' : 'bg-discord-light hover:bg-discord-lighter'
            }`}
            onClick={() => mainView !== 'preview' ? setMainView('browse') : null}
            title="Preview Messages"
          >
            <Eye className="w-6 h-6 text-discord-text" />
          </div>
          
          <div 
            className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
              mainView === 'export' ? 'bg-discord-primary' : 'bg-discord-light hover:bg-discord-lighter'
            }`}
            onClick={() => setMainView('export')}
            title="Export Chats"
          >
            <Download className="w-6 h-6 text-discord-text" />
          </div>
          
          <div 
            className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
              mainView === 'viewer' ? 'bg-discord-primary' : 'bg-discord-light hover:bg-discord-lighter'
            }`}
            onClick={() => setMainView('viewer')}
            title="View Exports"
          >
            <FileText className="w-6 h-6 text-discord-text" />
          </div>
          
          <div 
            className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
              mainView === 'settings' ? 'bg-discord-primary' : 'bg-discord-light hover:bg-discord-lighter'
            }`}
            onClick={() => setMainView('settings')}
            title="Settings"
          >
            <Settings className="w-6 h-6 text-discord-text" />
          </div>
        </div>

        {/* User Profile */}
        <div className="mt-auto">
          {currentUser && (
            <div className="w-12 h-12 rounded-full overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
              <img
                src={currentUser.avatarUrl || 'https://via.placeholder.com/48/40444B/72767D?text=?'}
                alt={currentUser.username}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          {/* GitHub Link */}
          <div className="mt-4">
            <a
              href="https://github.com/HassanXTech/DiscordChatExporter.git"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-discord-light hover:bg-discord-lighter rounded-full flex items-center justify-center cursor-pointer transition-colors"
              title="View on GitHub"
            >
              <svg className="w-6 h-6 text-discord-text" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {renderMainContent()}
    </div>
  );
}

export default App;
