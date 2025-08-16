import React, { useState } from 'react';
import { 
  Search, 
  Download, 
  Eye, 
  Settings, 
  Users, 
  Folder, 
  Lock, 
  MoreVertical,
  Loader2
} from 'lucide-react';

interface BrowseComponentProps {
  guilds: any[];
  dmChannels: any[];
  selectedGuild: any;
  selectedChannel: any;
  selectedDM: any;
  channels: any[];
  members: any[];
  isLoadingGuilds: boolean;
  isLoadingDMs: boolean;
  isLoadingChannels: boolean;
  isLoadingMembers: boolean;
  onGuildSelect: (guild: any) => void;
  onChannelSelect: (channel: any) => void;
  onDMSelect: (dm: any) => void;
  onExport: () => void;
  onViewer: () => void;
  onSettings: () => void;
}

const BrowseComponent: React.FC<BrowseComponentProps> = ({
  guilds,
  dmChannels,
  selectedGuild,
  selectedChannel,
  selectedDM,
  channels,
  members,
  isLoadingGuilds,
  isLoadingDMs,
  isLoadingChannels,
  isLoadingMembers,
  onGuildSelect,
  onChannelSelect,
  onDMSelect,
  onExport,
  onViewer,
  onSettings
}) => {
  const [activeTab, setActiveTab] = useState<'servers' | 'dms'>('servers');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const getChannelIcon = (channel: any) => {
    if (channel.isCategory) return <Folder className="w-4 h-4" />;
    if (channel.isVoice) return <Users className="w-4 h-4" />; // Changed from Phone to Users for voice channels
    return <Users className="w-4 h-4" />; // Default for text channels
  };

  const isChannelLocked = (channel: any) => {
    // Only show lock if we explicitly know the channel is locked
    if (!channel) return false;
    
    // Voice channels (type 2) are never "locked" for reading messages
    if (channel.type === 2) return false;
    
    // Category channels (type 4) are never "locked" for reading messages
    if (channel.type === 4) return false;
    
    // For text channels, we'll only show lock if we have explicit evidence
    // that the user can't read messages in this channel
    // This prevents false positives where permissions aren't loaded yet
    
    // Check if we have explicit permission data and it shows no read access
    if (channel.permissionOverwrites && channel.permissionOverwrites.length > 0) {
      // This would require parsing permission overwrites to determine access
      // For now, assume accessible unless we know otherwise
      return false;
    }
    
    // Default: assume accessible (no lock icon)
    return false;
  };

  const renderChannelsByCategory = () => {
    if (!channels || channels.length === 0) {
      return (
        <div className="text-center py-4 text-discord-textMuted">
          <p>No channels found</p>
        </div>
      );
    }

    // Separate channels by type and organize by categories
    const categories = channels.filter(ch => ch.type === 4); // Category channels
    const textChannels = channels.filter(ch => ch.type === 0); // Text channels
    const voiceChannels = channels.filter(ch => ch.type === 2); // Voice channels

    // Group channels under their categories
    const channelsByCategory = new Map();
    
    // Add uncategorized channels
    const uncategorized = {
      id: 'uncategorized',
      name: 'No Category',
      channels: [...textChannels.filter(ch => !ch.categoryId), ...voiceChannels.filter(ch => !ch.categoryId)]
    };
    channelsByCategory.set('uncategorized', uncategorized);

    // Group channels under their categories
    categories.forEach(category => {
      const categoryChannels = [
        ...textChannels.filter(ch => ch.categoryId === category.id),
        ...voiceChannels.filter(ch => ch.categoryId === category.id)
      ];
      
      if (categoryChannels.length > 0) {
        channelsByCategory.set(category.id, {
          id: category.id,
          name: category.name,
          channels: categoryChannels
        });
      }
    });

    // Sort categories by position (if available) or alphabetically
    const sortedCategories = Array.from(channelsByCategory.values()).sort((a: any, b: any) => {
      if (a.id === 'uncategorized') return 1; // Uncategorized goes last
      if (b.id === 'uncategorized') return -1;
      return (a.name || '').localeCompare(b.name || '');
    });

    return sortedCategories.map(category => (
      <div key={category.id} className="mb-4">
        {/* Category Header */}
        {category.id !== 'uncategorized' && (
          <div className="flex items-center space-x-2 mb-2 px-2">
            <Folder className="w-4 h-4 text-discord-textMuted" />
            <span className="text-xs font-semibold text-discord-textMuted uppercase tracking-wide">
              {category.name}
            </span>
          </div>
        )}
        
        {/* Category Channels */}
        <div className="space-y-1">
          {category.channels
            .sort((a: any, b: any) => {
              // Sort by type first (text before voice), then by position
              if (a.type !== b.type) return a.type - b.type;
              return (a.position || 0) - (b.position || 0);
            })
            .map((channel: any) => (
              <div
                key={channel.id}
                onClick={() => onChannelSelect(channel)}
                className={`p-2 rounded cursor-pointer transition-colors ${
                  selectedChannel?.id === channel.id
                    ? 'bg-discord-primary text-white'
                    : 'text-discord-text hover:bg-discord-light'
                } ${isChannelLocked(channel) ? 'opacity-60' : ''}`}
              >
                <div className="flex items-center space-x-2">
                  {getChannelIcon(channel)}
                  <div className="flex items-center space-x-2 flex-1">
                    <span className="text-sm truncate">
                      {channel.type === 2 ? '' : '#'}{channel.name}
                    </span>
                    {isChannelLocked(channel) && (
                      <Lock className="w-4 h-4 text-discord-warning" />
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    ));
  };

  const renderMemberCount = () => {
    if (!members || members.length === 0) {
      return 'No members';
    }

    // Try to get online count from member statuses
    const onlineCount = members.filter(m => 
      m?.user?.status === 'online' || 
      m?.user?.status === 'idle' || 
      m?.user?.status === 'dnd'
    ).length;

    // If we have online status data, show it
    if (onlineCount > 0) {
      return `Online — ${onlineCount}`;
    }

    // Otherwise, just show total member count
    return `${members.length} members`;
  };

  const renderGuildMemberCount = (guild: any) => {
    if (guild?.approximateMemberCount) {
      return `${guild.approximateMemberCount} members`;
    }
    return 'Unknown members';
  };

  const getMemberRoleIcon = (member: any) => {
    if (member?.roles?.includes('owner')) return <Users className="w-3 h-3 text-yellow-400" />; // Changed from Crown to Users
    if (member?.roles?.includes('admin')) return <Users className="w-3 h-3 text-red-400" />; // Changed from Shield to Users
    if (member?.roles?.includes('mod')) return <Users className="w-3 h-3 text-blue-400" />; // Changed from Shield to Users
    if (member?.user?.isBot) return <Users className="w-3 h-3 text-purple-400" />; // Changed from Bot to Users
    return null;
  };

  const filteredGuilds = (guilds || []).filter(guild => 
    guild?.name?.toLowerCase().includes((searchQuery || '').toLowerCase()) || false
  ).sort((a, b) => {
    // Respect Discord's server ordering (position-based)
    // Discord servers are ordered by user's custom arrangement
    const aPos = a.position ?? 0;
    const bPos = b.position ?? 0;
    
    // Sort by position (lower position = higher in list)
    if (aPos !== bPos) {
      return aPos - bPos;
    }
    
    // If positions are the same, maintain original order
    return 0;
  });

  const filteredDMs = (dmChannels || []).filter(dm => {
    const name = dm?.isGroup ? dm?.name : dm?.recipients?.[0]?.name || '';
    return (name || '').toLowerCase().includes((searchQuery || '').toLowerCase());
  }).sort((a, b) => {
    // Sort DMs by most recent activity (like Discord)
    // Use lastMessageTimestamp if available, otherwise fall back to position
    const aTime = a.lastMessageTimestamp ? new Date(a.lastMessageTimestamp).getTime() : 0;
    const bTime = b.lastMessageTimestamp ? new Date(b.lastMessageTimestamp).getTime() : 0;
    
    if (aTime && bTime) {
      // Both have timestamps - sort by newest first
      return bTime - aTime;
    } else if (aTime && !bTime) {
      // A has timestamp, B doesn't - A goes first
      return -1;
    } else if (!aTime && bTime) {
      // B has timestamp, A doesn't - B goes first
      return 1;
    } else {
      // Neither has timestamp - maintain original order
      return 0;
    }
  });

  const filteredChannels = (channels || []).filter(channel => 
    channel?.name?.toLowerCase().includes((searchQuery || '').toLowerCase()) || false
  );

  return (
    <div className="flex-1 flex">
      {/* Servers & DMs Sidebar */}
      <div className="w-80 bg-discord-dark border-r border-discord-lighter flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-discord-lighter">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-discord-text">Browse</h2>
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab('servers')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  activeTab === 'servers'
                    ? 'bg-discord-primary text-white'
                    : 'text-discord-textMuted hover:text-discord-text'
                }`}
              >
                Servers
              </button>
              <button
                onClick={() => setActiveTab('dms')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  activeTab === 'dms'
                    ? 'bg-discord-primary text-white'
                    : 'text-discord-textMuted hover:text-discord-text'
                }`}
              >
                DMs
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-discord-textMuted" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-discord-light border border-discord-lighter rounded text-discord-text placeholder-discord-textMuted focus:outline-none focus:border-discord-primary"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'servers' ? (
            <div className="p-4 space-y-2">
              {isLoadingGuilds ? (
                <div className="text-center py-8">
                  <Loader2 className="w-10 h-10 text-discord-primary animate-spin mx-auto" />
                  <p className="text-discord-textMuted mt-4">Loading servers...</p>
                </div>
              ) : filteredGuilds.map((guild, index) => (
                <div
                  key={guild?.id || `guild-${index}`}
                  onClick={() => onGuildSelect(guild)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedGuild?.id === guild?.id
                      ? 'bg-discord-primary text-white'
                      : 'bg-discord-light hover:bg-discord-lighter text-discord-text'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                                           <img
                         src={guild?.iconUrl || 'https://via.placeholder.com/32/40444B/72767D?text=?'}
                         alt={guild?.name || 'Unknown'}
                         className="w-8 h-8 rounded-full"
                       />
                    <div className="flex-1 min-w-0">
                                               <h3 className="font-medium truncate">{guild?.name || 'Unknown'}</h3>
                                               <p className="text-xs opacity-75 truncate">
                           {renderGuildMemberCount(guild)}
                         </p>
                    </div>
                                         {guild?.isOwner && (
                       <Users className="w-4 h-4 text-yellow-400" />
                     )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 space-y-2">
              {isLoadingDMs ? (
                <div className="text-center py-8">
                  <Loader2 className="w-10 h-10 text-discord-primary animate-spin mx-auto" />
                  <p className="text-discord-textMuted mt-4">Loading DMs...</p>
                </div>
              ) : filteredDMs.map((dm, index) => (
                <div
                  key={dm?.id || `dm-${index}`}
                  onClick={() => onDMSelect(dm)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedDM?.id === dm?.id
                      ? 'bg-discord-primary text-white'
                      : 'bg-discord-light hover:bg-discord-lighter text-discord-text'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {dm.isGroup ? (
                      <div className="w-8 h-8 bg-discord-primary rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                    ) : (
                                               <img
                           src={dm?.recipients?.[0]?.avatarUrl || 'https://via.placeholder.com/32/40444B/72767D?text=?'}
                           alt={dm?.recipients?.[0]?.name || 'Unknown'}
                           className="w-8 h-8 rounded-full"
                         />
                    )}
                    <div className="flex-1 min-w-0">
                                               <h3 className="font-medium truncate">
                           {dm?.isGroup ? dm?.name : dm?.recipients?.[0]?.name || 'Unknown'}
                         </h3>
                         <p className="text-xs opacity-75 truncate">
                           {dm?.isGroup ? `${dm?.recipients?.length || 0} members` : 'Direct message'}
                         </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-t border-discord-lighter">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onExport}
              className="discord-button-secondary text-sm py-2 flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button
              onClick={onViewer}
              className="discord-button-secondary text-sm py-2 flex items-center justify-center space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Channels & Content Sidebar */}
      {selectedGuild && (
        <div className="w-80 bg-discord-dark border-r border-discord-lighter flex flex-col">
          {/* Guild Header */}
          <div className="p-4 border-b border-discord-lighter">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                                 <img
                   src={selectedGuild?.iconUrl || 'https://via.placeholder.com/32/40444B/72767D?text=?'}
                   alt={selectedGuild?.name || 'Unknown'}
                   className="w-8 h-8 rounded-full"
                 />
                                 <div>
                   <h3 className="font-semibold text-discord-text">{selectedGuild?.name || 'Unknown'}</h3>
                   <p className="text-sm text-discord-textMuted">
                     {selectedGuild?.approximateMemberCount || 'Unknown'} members
                   </p>
                 </div>
              </div>
              <button className="text-discord-textMuted hover:text-discord-text">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Channels */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-1">
              {isLoadingChannels ? (
                <div className="text-center py-8">
                  <Loader2 className="w-10 h-10 text-discord-primary animate-spin mx-auto" />
                  <p className="text-discord-textMuted mt-4">Loading channels...</p>
                </div>
              ) : renderChannelsByCategory()}
            </div>
          </div>

          {/* Members */}
          <div className="p-4 border-t border-discord-lighter">
            <h3 className="text-sm font-medium text-discord-text mb-3">
              {isLoadingMembers ? 'Loading members...' : renderMemberCount()}
            </h3>
            {isLoadingMembers ? (
              <div className="text-center py-8">
                <Loader2 className="w-10 h-10 text-discord-primary animate-spin mx-auto" />
                <p className="text-discord-textMuted mt-4">Loading members...</p>
              </div>
            ) : members && members.length > 0 && (
              <div className="space-y-2">
                {members.slice(0, 8).map((member, index) => (
                  <div key={member?.user?.id || `member-${index}`} className="flex items-center space-x-2 text-sm">
                    <div className={`w-3 h-3 rounded-full ${
                      member?.user?.status === 'online' ? 'bg-discord-success' :
                      member?.user?.status === 'idle' ? 'bg-discord-warning' :
                      member?.user?.status === 'dnd' ? 'bg-discord-danger' :
                      'bg-discord-textMuted'
                    }`}></div>
                    <span className="text-discord-textMuted truncate flex-1">
                      {member?.nick || member?.user?.username || 'Unknown'}
                    </span>
                    {getMemberRoleIcon(member)}
                  </div>
                ))}
                {members.length > 8 && (
                  <p className="text-xs text-discord-textMuted text-center">
                    +{members.length - 8} more
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 bg-discord-darkest flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto p-8">
          <div className="w-32 h-32 bg-gradient-to-br from-discord-primary to-discord-secondary rounded-full flex items-center justify-center mx-auto mb-8">
            <Users className="w-16 h-16 text-white" /> {/* Changed from MessageCircle to Users */}
          </div>
          
                     <h1 className="text-4xl font-bold text-discord-text mb-4">
             {selectedGuild ? `Welcome to ${selectedGuild?.name || 'Unknown'}` : 'Welcome to Discord Chat Exporter'}
           </h1>
          
          <p className="text-xl text-discord-textMuted mb-8">
            {selectedGuild 
              ? 'Select a channel to preview messages or start exporting'
              : 'Select a server or DM to browse channels and messages'
            }
          </p>

          {selectedGuild && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="discord-card cursor-pointer hover:bg-discord-light transition-colors" onClick={() => (channels || [])[0] && onChannelSelect((channels || [])[0])}>
                <Eye className="w-12 h-12 text-discord-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-discord-text mb-2">Preview Messages</h3>
                <p className="text-discord-textMuted">View live messages in any channel</p>
              </div>
              <div className="discord-card cursor-pointer hover:bg-discord-light transition-colors" onClick={onExport}>
                <Download className="w-12 h-12 text-discord-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-discord-text mb-2">Export Chat</h3>
                <p className="text-discord-textMuted">Export channel messages to JSON</p>
              </div>
            </div>
          )}

          {!selectedGuild && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="discord-card cursor-pointer hover:bg-discord-light transition-colors" onClick={() => setActiveTab('servers')}>
                <Users className="w-12 h-12 text-discord-primary mx-auto mb-4" /> {/* Changed from Server to Users */}
                <h3 className="text-xl font-semibold text-discord-text mb-2">Browse Servers</h3>
                <p className="text-discord-textMuted">View your Discord servers</p>
              </div>
              <div className="discord-card cursor-pointer hover:bg-discord-light transition-colors" onClick={() => setActiveTab('dms')}>
                <Users className="w-12 h-12 text-discord-primary mx-auto mb-4" /> {/* Changed from MessageCircle to Users */}
                <h3 className="text-xl font-semibold text-discord-text mb-2">Direct Messages</h3>
                <p className="text-discord-textMuted">View your private conversations</p>
              </div>
              <div className="discord-card cursor-pointer hover:bg-discord-light transition-colors" onClick={onViewer}>
                <Eye className="w-12 h-12 text-discord-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-discord-text mb-2">View Exports</h3>
                <p className="text-discord-textMuted">Browse exported chat files</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowseComponent;
