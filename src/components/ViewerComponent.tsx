import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, 
  Upload, 
  Download, 
  Eye, 
  Search, 
  FileText, 
  Image, 
  Video, 
  Music, 
  Link,
  Calendar,
  User,
  Bot,
  Crown,
  Shield,
  Hash,
  MessageCircle,
  Users,
  Settings,
  Trash2,
  Info,
  Filter,
  SortAsc,
  SortDesc
} from 'lucide-react';
import chatViewerService from '../services/chatViewerService';

interface ViewerComponentProps {
  onBack: () => void;
  onExport: () => void;
}

const ViewerComponent: React.FC<ViewerComponentProps> = ({
  onBack,
  onExport
}) => {
  const [loadedExports, setLoadedExports] = useState<any[]>([]);
  const [selectedExport, setSelectedExport] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'guild' | 'dm'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showImages, setShowImages] = useState(true);
  const [showEmbeds, setShowEmbeds] = useState(true);
  const [showReactions, setShowReactions] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const result = await chatViewerService.loadExport(file);
        if (result.success && result.data) {
          setLoadedExports(prev => [...prev, result.data]);
        }
      } catch (error) {
        console.error('Failed to load export:', error);
      }
    }
  };

  const removeExport = (exportId: string) => {
    chatViewerService.removeExport(exportId);
    setLoadedExports(prev => prev.filter(exp => exp.id !== exportId));
    if (selectedExport?.id === exportId) {
      setSelectedExport(null);
    }
  };

  const clearAllExports = () => {
    if (window.confirm('Are you sure you want to remove all loaded exports?')) {
      chatViewerService.clearExports();
      setLoadedExports([]);
      setSelectedExport(null);
    }
  };

  const getExportStats = (exportId: string) => {
    return chatViewerService.getExportStats(exportId);
  };

  const getFilteredExports = () => {
    let filtered = loadedExports;

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(exp => {
        if (filterType === 'guild') return exp.guild;
        if (filterType === 'dm') return !exp.guild;
        return true;
      });
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(exp => {
        const name = exp.guild?.name || exp.channel?.name || 'Unknown';
        return name.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.metadata?.exportDate || 0);
          bValue = new Date(b.metadata?.exportDate || 0);
          break;
        case 'name':
          aValue = a.guild?.name || a.channel?.name || '';
          bValue = b.guild?.name || b.channel?.name || '';
          break;
        case 'size':
          aValue = a.messages?.length || 0;
          bValue = b.messages?.length || 0;
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  };

  const formatFileSize = (messages: any[]) => {
    const size = messages?.length || 0;
    if (size < 1000) return `${size} messages`;
    if (size < 1000000) return `${(size / 1000).toFixed(1)}K messages`;
    return `${(size / 1000000).toFixed(1)}M messages`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const renderMessage = (message: any) => {
    return (
      <div key={message.id} className="discord-card bg-discord-dark hover:bg-discord-light transition-colors">
        <div className="flex items-start space-x-3">
          <img
            src={message.author?.avatarUrl || 'https://via.placeholder.com/40/40444B/72767D?text=?'}
            alt={message.author?.name || 'Unknown'}
            className="w-10 h-10 rounded-full flex-shrink-0"
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-medium text-discord-text">{message.author?.name || 'Unknown'}</span>
              {message.author?.isBot && (
                <span className="px-1.5 py-0.5 bg-discord-primary text-white text-xs rounded">BOT</span>
              )}
              <span className="text-sm text-discord-textMuted">
                {new Date(message.timestamp).toLocaleString()}
              </span>
            </div>
            
            <div className="text-discord-text">
              <p className="whitespace-pre-wrap">{message.content}</p>
              
              {/* Attachments */}
              {showImages && message.attachments && message.attachments.length > 0 && (
                <div className="mt-2 space-y-2">
                  {message.attachments.map((attachment: any, index: number) => (
                    <div key={index}>
                      {attachment.isImage ? (
                        <img
                          src={attachment.url}
                          alt={attachment.fileName}
                          className="max-w-full max-h-48 rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => window.open(attachment.url, '_blank')}
                        />
                      ) : (
                        <div className="p-2 bg-discord-light rounded border border-discord-lighter">
                          <div className="flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-discord-textMuted" />
                            <span className="text-sm text-discord-text">{attachment.fileName}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {/* Embeds */}
              {showEmbeds && message.embeds && message.embeds.length > 0 && (
                <div className="mt-2 space-y-2">
                  {message.embeds.map((embed: any, index: number) => (
                    <div key={index} className="p-3 bg-discord-light rounded-lg border-l-4 border-l-blue-500">
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
              
              {/* Reactions */}
              {showReactions && message.reactions && message.reactions.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {message.reactions.map((reaction: any, index: number) => (
                    <div
                      key={index}
                      className="px-2 py-1 bg-discord-light rounded-full text-xs text-discord-textMuted flex items-center space-x-1"
                    >
                      <span>{reaction.emoji?.name || '?'}</span>
                      <span>{reaction.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const filteredExports = getFilteredExports();

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
              <FileText className="w-6 h-6 text-discord-primary" />
              <h2 className="text-xl font-semibold text-discord-text">View Exports</h2>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="discord-button text-sm px-4 py-2 flex items-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>Load Export</span>
            </button>
            <button
              onClick={onExport}
              className="discord-button-secondary text-sm px-4 py-2 flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-discord-dark border-b border-discord-lighter p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-discord-textMuted" />
              <input
                type="text"
                placeholder="Search exports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-discord-light border border-discord-lighter rounded text-discord-text placeholder-discord-textMuted focus:outline-none focus:border-discord-primary w-64"
              />
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="discord-input text-sm"
            >
              <option value="all">All Types</option>
              <option value="guild">Servers</option>
              <option value="dm">Direct Messages</option>
            </select>
            
            <div className="flex items-center space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="discord-input text-sm"
              >
                <option value="date">Date</option>
                <option value="name">Name</option>
                <option value="size">Size</option>
              </select>
              
              <button
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="p-2 rounded hover:bg-discord-light transition-colors text-discord-textMuted hover:text-discord-text"
              >
                {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-sm">
            <label className="flex items-center space-x-2 text-discord-textMuted hover:text-discord-text cursor-pointer">
              <input
                type="checkbox"
                checked={showImages}
                onChange={(e) => setShowImages(e.target.checked)}
                className="rounded border-discord-lighter text-discord-primary focus:ring-discord-primary"
              />
              <Image className="w-4 h-4" />
              <span>Images</span>
            </label>
            
            <label className="flex items-center space-x-2 text-discord-textMuted hover:text-discord-text cursor-pointer">
              <input
                type="checkbox"
                checked={showEmbeds}
                onChange={(e) => setShowEmbeds(e.target.checked)}
                className="rounded border-discord-lighter text-discord-primary focus:ring-discord-primary"
              />
              <Link className="w-4 h-4" />
              <span>Embeds</span>
            </label>
            
            <label className="flex items-center space-x-2 text-discord-textMuted hover:text-discord-text cursor-pointer">
              <input
                type="checkbox"
                checked={showReactions}
                onChange={(e) => setShowReactions(e.target.checked)}
                className="rounded border-discord-lighter text-discord-primary focus:ring-discord-primary"
              />
              <span>Reactions</span>
            </label>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex">
        {/* Exports List */}
        <div className="w-80 bg-discord-dark border-r border-discord-lighter flex flex-col">
          <div className="p-4 border-b border-discord-lighter">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-discord-text">Loaded Exports</h3>
              {loadedExports.length > 0 && (
                <button
                  onClick={clearAllExports}
                  className="text-discord-danger hover:text-red-400 transition-colors"
                  title="Clear all exports"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="text-sm text-discord-textMuted">{filteredExports.length} exports</p>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {filteredExports.length === 0 ? (
              <div className="p-4 text-center">
                <FileText className="w-12 h-12 text-discord-textMuted mx-auto mb-2" />
                <p className="text-discord-textMuted text-sm">No exports loaded</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-discord-primary hover:underline text-sm mt-2"
                >
                  Load your first export
                </button>
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {filteredExports.map((exp) => {
                  const stats = getExportStats(exp.id);
                  return (
                    <div
                      key={exp.id}
                      onClick={() => setSelectedExport(exp)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedExport?.id === exp.id
                          ? 'bg-discord-primary text-white'
                          : 'bg-discord-light hover:bg-discord-lighter text-discord-text'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {exp.guild ? (
                          <div className="w-8 h-8 bg-discord-primary rounded-full flex items-center justify-center">
                            <Hash className="w-4 h-4 text-white" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 bg-discord-success rounded-full flex items-center justify-center">
                            <MessageCircle className="w-4 h-4 text-white" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">
                            {exp.exportName || exp.guild?.name || exp.channel?.name || 'Unknown'}
                          </h4>
                          <p className="text-xs opacity-75 truncate">
                            {stats ? `${stats.totalMessages} messages` : 'Loading...'}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeExport(exp.id);
                          }}
                          className="text-discord-textMuted hover:text-discord-danger transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Export Content */}
        <div className="flex-1 bg-discord-darkest">
          {selectedExport ? (
            <div className="h-full flex flex-col">
              {/* Export Header */}
              <div className="bg-discord-dark border-b border-discord-lighter p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-discord-text">
                      {selectedExport.exportName || selectedExport.guild?.name || selectedExport.channel?.name || 'Unknown Export'}
                    </h3>
                    <p className="text-sm text-discord-textMuted">
                      {selectedExport.metadata?.exportDate && formatDate(selectedExport.metadata.exportDate)}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="text-sm text-discord-textMuted">
                      {selectedExport.messages?.length || 0} messages
                    </div>
                    <button
                      onClick={() => {
                        const dataStr = JSON.stringify(selectedExport, null, 2);
                        const dataBlob = new Blob([dataStr], { type: 'application/json' });
                        const url = URL.createObjectURL(dataBlob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `export-${Date.now()}.json`;
                        link.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="discord-button-secondary text-sm px-3 py-1 flex items-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="max-w-4xl mx-auto space-y-4">
                  {selectedExport.messages?.map((message: any) => renderMessage(message))}
                  
                  {(!selectedExport.messages || selectedExport.messages.length === 0) && (
                    <div className="text-center py-12">
                      <MessageCircle className="w-16 h-16 text-discord-textMuted mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-discord-text mb-2">No messages found</h3>
                      <p className="text-discord-textMuted">
                        This export doesn't contain any messages
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <FileText className="w-32 h-32 text-discord-textMuted mx-auto mb-8" />
                <h3 className="text-2xl font-bold text-discord-text mb-4">No Export Selected</h3>
                <p className="text-discord-textMuted mb-8">
                  Select an export from the list to view its messages
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="discord-button text-lg px-6 py-3 flex items-center space-x-2 mx-auto"
                >
                  <Upload className="w-6 h-6" />
                  <span>Load Your First Export</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".json"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};

export default ViewerComponent;
