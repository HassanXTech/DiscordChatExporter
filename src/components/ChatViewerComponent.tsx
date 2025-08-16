import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Upload, Search, MessageSquare, Users, FileText, Download, Hash } from 'lucide-react';
import { DiscordMessage, DiscordChannel } from '../types';
import chatViewerService from '../services/chatViewerService';

interface ChatViewerComponentProps {
  onBackToExport: () => void;
}

const ChatViewerComponent: React.FC<ChatViewerComponentProps> = ({ onBackToExport }) => {
  const [loadedExports, setLoadedExports] = useState<any[]>([]);
  const [selectedExport, setSelectedExport] = useState<any>(null);
  const [selectedChannel, setSelectedChannel] = useState<DiscordChannel | null>(null);
  const [messages, setMessages] = useState<DiscordMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<DiscordMessage[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSampleData, setShowSampleData] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadExports = () => {
    const exports = chatViewerService.getLoadedExports();
    setLoadedExports(exports);
  };

  const loadMessages = useCallback(async () => {
    if (!selectedExport || !selectedChannel) return;

    try {
      const messagesData = await chatViewerService.getMessagesByChannel(
        selectedExport.id,
        selectedChannel.id,
        100
      );
      setMessages(messagesData);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  }, [selectedExport, selectedChannel]);

  useEffect(() => {
    loadExports();
  }, []);

  useEffect(() => {
    if (selectedExport && selectedChannel) {
      loadMessages();
    }
  }, [selectedExport, selectedChannel, loadMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const result = await chatViewerService.loadExport(file);
      if (result.success && result.data) {
        setLoadedExports(prev => [...prev, result.data]);
        setSelectedExport(result.data);
        if (result.data.channels && result.data.channels.length > 0) {
          setSelectedChannel(result.data.channels[0]);
        }
      } else {
        alert(result.error || 'Failed to load export');
      }
    } catch (error) {
      alert('Failed to load export file');
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim() || !selectedExport) return;

    setIsSearching(true);
    try {
      const results = await chatViewerService.searchMessages(selectedExport.id, searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLoadSampleData = () => {
    const sampleData = chatViewerService.generateSampleExport();
    const exportId = `sample_${Date.now()}`;
    const sampleExport = {
      id: exportId,
      ...sampleData
    };

    setLoadedExports(prev => [...prev, sampleExport]);
    setSelectedExport(sampleExport);
    if (sampleExport.channels && sampleExport.channels.length > 0) {
      setSelectedChannel(sampleExport.channels[0]);
    }
    setShowSampleData(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const renderMessage = (message: DiscordMessage) => (
    <div key={message.id} className="flex space-x-3 p-3 hover:bg-discord-light/50 rounded-lg group">
      <img
        src={message.author.avatarUrl || 'https://via.placeholder.com/40/40444B/72767D?text=?'}
        alt={message.author.name}
        className="w-10 h-10 rounded-full flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <span className="font-medium text-discord-text">
            {message.author.name}
            {message.author.discriminator && (
              <span className="text-discord-textMuted">#{message.author.discriminator}</span>
            )}
          </span>
          <span className="text-xs text-discord-textMuted">
            {formatTimestamp(message.timestamp)}
          </span>
          {message.isPinned && (
            <span className="text-xs text-discord-warning">📌 Pinned</span>
          )}
        </div>
        <div className="text-discord-text whitespace-pre-wrap break-words">
          {message.content}
        </div>
        {message.attachments.length > 0 && (
          <div className="mt-2 space-y-2">
            {message.attachments.map((attachment) => (
              <div key={attachment.id} className="flex items-center space-x-2 p-2 bg-discord-dark rounded">
                <FileText className="w-4 h-4 text-discord-textMuted" />
                <span className="text-sm text-discord-text">{attachment.fileName}</span>
                <span className="text-xs text-discord-textMuted">
                  ({(attachment.fileSizeBytes / 1024).toFixed(1)} KB)
                </span>
              </div>
            ))}
          </div>
        )}
        {message.embeds.length > 0 && (
          <div className="mt-2 space-y-2">
            {message.embeds.map((embed, index) => (
              <div key={index} className="border-l-4 border-discord-primary pl-3 py-2 bg-discord-dark rounded">
                {embed.title && (
                  <h4 className="font-medium text-discord-text mb-1">{embed.title}</h4>
                )}
                {embed.description && (
                  <p className="text-sm text-discord-textMuted">{embed.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-discord-darkest flex">
      {/* Sidebar */}
      <div className="w-64 bg-discord-dark border-r border-discord-lighter flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-discord-lighter">
          <h2 className="text-lg font-semibold text-discord-text">Chat Viewer</h2>
          <button
            onClick={onBackToExport}
            className="text-sm text-discord-textMuted hover:text-discord-text mt-1"
          >
            ← Back to Export
          </button>
        </div>

        {/* File Upload */}
        <div className="p-4 border-b border-discord-lighter">
          <label className="block text-sm font-medium text-discord-text mb-2">
            Load Export File
          </label>
          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="discord-button-secondary w-full text-center cursor-pointer"
          >
            <Upload className="w-4 h-4 inline mr-2" />
            Choose File
          </label>
          
          {!loadedExports.length && (
            <button
              onClick={() => setShowSampleData(true)}
              className="w-full mt-2 text-sm text-discord-textMuted hover:text-discord-text"
            >
              Or try sample data
            </button>
          )}
        </div>

        {/* Exports List */}
        {loadedExports.length > 0 && (
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-sm font-medium text-discord-text mb-2">Loaded Exports</h3>
              <div className="space-y-2">
                {loadedExports.map((exportData) => (
                  <div
                    key={exportData.id}
                    onClick={() => {
                      setSelectedExport(exportData);
                      if (exportData.channels && exportData.channels.length > 0) {
                        setSelectedChannel(exportData.channels[0]);
                      }
                    }}
                    className={`p-2 rounded cursor-pointer transition-colors ${
                      selectedExport?.id === exportData.id
                        ? 'bg-discord-primary text-white'
                        : 'text-discord-text hover:bg-discord-light'
                    }`}
                  >
                    <div className="text-sm font-medium">
                      {exportData.guild?.name || 'Unknown Server'}
                    </div>
                    <div className="text-xs opacity-75">
                      {exportData.messages?.length || 0} messages
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Channels List */}
            {selectedExport && (
              <div className="p-4 border-t border-discord-lighter">
                <h3 className="text-sm font-medium text-discord-text mb-2">Channels</h3>
                <div className="space-y-1">
                  {selectedExport.channels?.map((channel: DiscordChannel) => (
                    <div
                      key={channel.id}
                      onClick={() => setSelectedChannel(channel)}
                      className={`p-2 rounded cursor-pointer transition-colors ${
                        selectedChannel?.id === channel.id
                          ? 'bg-discord-primary text-white'
                          : 'text-discord-text hover:bg-discord-light'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Hash className="w-4 h-4" />
                        <span className="text-sm">#{channel.name}</span>
                      </div>
                      <div className="text-xs opacity-75 ml-6">
                        {channel.messageCount} messages
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-discord-dark border-b border-discord-lighter p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Hash className="w-5 h-5 text-discord-textMuted" />
              <div>
                <h1 className="text-lg font-semibold text-discord-text">
                  {selectedChannel ? `#${selectedChannel.name}` : 'Select a channel'}
                </h1>
                {selectedChannel?.topic && (
                  <p className="text-sm text-discord-textMuted">{selectedChannel.topic}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-discord-textMuted" />
              <span className="text-sm text-discord-textMuted">
                {selectedChannel?.memberCount || 'Unknown'} members
              </span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        {selectedExport && (
          <div className="bg-discord-dark border-b border-discord-lighter p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 discord-input"
              />
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="discord-button-secondary px-4"
              >
                {isSearching ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto bg-discord-darkest">
          {!selectedExport ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-discord-textMuted">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-medium mb-2">No export loaded</h3>
                <p>Upload a Discord export file to start viewing messages</p>
              </div>
            </div>
          ) : !selectedChannel ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-discord-textMuted">
                <Hash className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-medium mb-2">No channel selected</h3>
                <p>Select a channel from the sidebar to view messages</p>
              </div>
            </div>
          ) : searchQuery && searchResults.length > 0 ? (
            <div className="p-4">
              <div className="mb-4 text-sm text-discord-textMuted">
                Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"
              </div>
              {searchResults.map(renderMessage)}
            </div>
          ) : (
            <div className="p-4">
              {messages.map(renderMessage)}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Sample Data Modal */}
      {showSampleData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-discord-dark border border-discord-lighter rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-discord-text mb-4">
              Load Sample Data
            </h3>
            <p className="text-discord-textMuted mb-6">
              This will load sample Discord chat data to demonstrate the viewer functionality.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleLoadSampleData}
                className="discord-button flex-1"
              >
                <Download className="w-4 h-4 mr-2" />
                Load Sample
              </button>
              <button
                onClick={() => setShowSampleData(false)}
                className="discord-button-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatViewerComponent;
