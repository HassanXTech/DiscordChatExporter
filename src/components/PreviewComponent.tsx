import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Download, 
  Eye, 
  Search, 
  MoreVertical, 
  Image, 
  Video, 
  Music, 
  FileText, 
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
  Folder,
  Phone,
  Loader2
} from 'lucide-react';
import discordService from '../services/discordService';

interface PreviewComponentProps {
  guild: any;
  channel: any;
  dm: any;
  onBack: () => void;
  onExport: () => void;
  onViewer: () => void;
}

const PreviewComponent: React.FC<PreviewComponentProps> = ({
  guild,
  channel,
  dm,
  onBack,
  onExport,
  onViewer
}) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showImages, setShowImages] = useState(true);
  const [showEmbeds, setShowEmbeds] = useState(true);
  const [showReactions, setShowReactions] = useState(true);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [oldestMessageId, setOldestMessageId] = useState<string | undefined>();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  // Auto-scroll to bottom when messages first load or when switching channels
  useEffect(() => {
    if (messages.length > 0 && !isLoading && shouldAutoScroll) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        setShouldAutoScroll(false);
      }, 100);
    }
  }, [messages, isLoading, shouldAutoScroll]);

  useEffect(() => {
    if (channel || dm) {
      setShouldAutoScroll(true); // Reset for new channel/DM
      loadMessages();
    }
  }, [channel, dm]);

  const loadMessages = async () => {
    setIsLoading(true);
    try {
      const channelId = channel?.id || dm?.id;
      // Discord API returns messages in reverse chronological order (newest first)
      // We need to reverse them to show newest at bottom (like Discord)
      const messagesData = await discordService.fetchChannelMessages(channelId, 100);
      
      if (messagesData.length > 0) {
        // Reverse the messages so newest appears at bottom (like Discord)
        const reversedMessages = [...messagesData].reverse();
        setMessages(reversedMessages);
        
        // Set the oldest message ID for pagination (scroll up to load more)
        setOldestMessageId(messagesData[messagesData.length - 1].id);
        setHasMoreMessages(messagesData.length === 100);
      } else {
        setMessages([]);
        setHasMoreMessages(false);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
      // Check if it's a permission error
      if (error instanceof Error && error.message.includes('permission')) {
        setMessages([]);
        setHasMoreMessages(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreMessages = async () => {
    if (!hasMoreMessages || isLoadingMore || !oldestMessageId) return;
    
    setIsLoadingMore(true);
    try {
      const channelId = channel?.id || dm?.id;
      const moreMessages = await discordService.fetchChannelMessages(channelId, 100, oldestMessageId);
      
      if (moreMessages.length > 0) {
        // Discord API returns messages in reverse chronological order
        // We need to reverse them and add to the beginning (top) since we're scrolling up
        const reversedMoreMessages = [...moreMessages].reverse();
        setMessages(prev => [...reversedMoreMessages, ...prev]);
        setOldestMessageId(moreMessages[moreMessages.length - 1].id);
        setHasMoreMessages(moreMessages.length === 100);
      } else {
        setHasMoreMessages(false);
      }
    } catch (error) {
      console.error('Failed to load more messages:', error);
      setHasMoreMessages(false);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if (target.scrollTop === 0 && hasMoreMessages && !isLoadingMore) {
      loadMoreMessages();
    }
  };

  const getChannelIcon = () => {
    if (channel) {
      if (channel.isCategory) return <Folder className="w-5 h-5" />;
      if (channel.isVoice) return <Phone className="w-5 h-5" />;
      return <Hash className="w-5 h-5" />;
    }
    if (dm?.isGroup) return <Users className="w-5 h-5" />;
    return <MessageCircle className="w-5 h-5" />;
  };

  const getChannelName = () => {
    if (channel) return `#${channel.name}`;
    if (dm?.isGroup) return dm.name;
    return dm?.recipients[0]?.name || 'Unknown';
  };

  const getChannelDescription = () => {
    if (channel) return channel.topic || 'No topic set';
    if (dm?.isGroup) return `${dm.recipients.length} members`;
    return 'Direct message';
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const renderAttachment = (attachment: any) => {
    if (attachment.isImage) {
      return (
        <div className="mt-2">
          <img
            src={attachment.url}
            alt={attachment.fileName}
            className="max-w-full max-h-64 rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => window.open(attachment.url, '_blank')}
          />
        </div>
      );
    }
    
    if (attachment.isVideo) {
      return (
        <div className="mt-2">
          <video
            src={attachment.url}
            controls
            className="max-w-full max-h-64 rounded-lg"
          />
        </div>
      );
    }
    
    if (attachment.isAudio) {
      return (
        <div className="mt-2">
          <audio
            src={attachment.url}
            controls
            className="w-full"
          />
        </div>
      );
    }
    
    return (
      <div className="mt-2 p-3 bg-discord-light rounded-lg border border-discord-lighter">
        <div className="flex items-center space-x-3">
          <FileText className="w-8 h-8 text-discord-textMuted" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-discord-text truncate">{attachment.fileName}</p>
            <p className="text-xs text-discord-textMuted">
              {(attachment.fileSizeBytes / 1024).toFixed(1)} KB
            </p>
          </div>
          <a
            href={attachment.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-discord-primary hover:text-discord-secondary transition-colors"
          >
            <Download className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  };

  const renderEmbed = (embed: any) => {
    return (
      <div className="mt-2 p-3 bg-discord-light rounded-lg border-l-4 border-l-blue-500">
        {embed.title && (
          <h4 className="font-medium text-discord-text mb-1">{embed.title}</h4>
        )}
        {embed.description && (
          <p className="text-sm text-discord-textMuted mb-2">{embed.description}</p>
        )}
        {embed.image && (
          <img
            src={embed.image.url}
            alt="Embed"
            className="max-w-full max-h-48 rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => window.open(embed.image.url, '_blank')}
          />
        )}
        {embed.footer && (
          <p className="text-xs text-discord-textMuted mt-2">{embed.footer.text}</p>
        )}
      </div>
    );
  };

  const renderReactions = (reactions: any[]) => {
    if (!reactions || reactions.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {reactions.map((reaction, index) => (
          <div
            key={index}
            className="px-2 py-1 bg-discord-light rounded-full text-xs text-discord-textMuted flex items-center space-x-1"
          >
            {reaction.emoji.imageUrl ? (
              <img
                src={reaction.emoji.imageUrl}
                alt={reaction.emoji.name}
                className="w-4 h-4"
              />
            ) : (
              <span>{reaction.emoji.name}</span>
            )}
            <span>{reaction.count}</span>
          </div>
        ))}
      </div>
    );
  };

  const filteredMessages = messages.filter(message =>
    message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.author.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex-1 bg-discord-darkest flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-discord-primary mx-auto mb-4"></div>
          <p className="text-discord-text">Loading messages...</p>
        </div>
      </div>
    );
  }

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
              {getChannelIcon()}
              <div>
                <h2 className="text-lg font-semibold text-discord-text">{getChannelName()}</h2>
                <p className="text-sm text-discord-textMuted">{getChannelDescription()}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={onExport}
              className="discord-button-secondary text-sm px-4 py-2 flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button
              onClick={onViewer}
              className="discord-button-secondary text-sm px-4 py-2 flex items-center space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>View Exports</span>
            </button>
            <button className="p-2 rounded-lg hover:bg-discord-light transition-colors text-discord-textMuted hover:text-discord-text">
              <MoreVertical className="w-5 h-5" />
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
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-discord-light border border-discord-lighter rounded text-discord-text placeholder-discord-textMuted focus:outline-none focus:border-discord-primary w-64"
              />
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
          
          <div className="text-sm text-discord-textMuted">
            {filteredMessages.length} of {messages.length} messages
          </div>
        </div>
      </div>

      {/* Messages */}
      <div 
        className="flex-1 overflow-y-auto p-4"
        onScroll={handleScroll}
      >
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Loading more indicator */}
          {isLoadingMore && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-discord-primary" />
              <span className="ml-2 text-discord-textMuted">Loading more messages...</span>
            </div>
          )}
          
          {filteredMessages.map((message) => (
            <div key={message.id} className="discord-card bg-discord-dark hover:bg-discord-light transition-colors">
              <div className="flex items-start space-x-3">
                <img
                  src={message.author.avatarUrl || 'https://via.placeholder.com/40/40444B/72767D?text=?'}
                  alt={message.author.name}
                  className="w-10 h-10 rounded-full flex-shrink-0"
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-discord-text">{message.author.name}</span>
                    {message.author.isBot && (
                      <span className="px-1.5 py-0.5 bg-discord-primary text-white text-xs rounded">BOT</span>
                    )}
                    <span className="text-sm text-discord-textMuted">{formatTimestamp(message.timestamp)}</span>
                    {message.isEdited && (
                      <span className="text-xs text-discord-textMuted">(edited)</span>
                    )}
                  </div>
                  
                  <div className="text-discord-text">
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    
                    {/* Attachments */}
                    {showImages && message.attachments && message.attachments.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {message.attachments.map((attachment: any, index: number) => (
                          <div key={index}>
                            {renderAttachment(attachment)}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Embeds */}
                    {showEmbeds && message.embeds && message.embeds.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {message.embeds.map((embed: any, index: number) => (
                          <div key={index}>
                            {renderEmbed(embed)}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Reactions */}
                    {showReactions && message.reactions && message.reactions.length > 0 && (
                      <div>
                        {renderReactions(message.reactions)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {filteredMessages.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-discord-textMuted mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-discord-text mb-2">No messages found</h3>
              <p className="text-discord-textMuted">
                Try adjusting your search query or filters
              </p>
            </div>
          )}
          
          {/* Invisible element for auto-scroll to bottom */}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
};

export default PreviewComponent;
