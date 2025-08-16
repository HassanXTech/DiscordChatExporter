import { DiscordMessage, DiscordChannel, DiscordGuild } from '../types';

// Real chat viewer service for Discord export files
export class ChatViewerService {
  private static instance: ChatViewerService;
  private loadedExports: Map<string, any> = new Map();

  public static getInstance(): ChatViewerService {
    if (!ChatViewerService.instance) {
      ChatViewerService.instance = new ChatViewerService();
    }
    return ChatViewerService.instance;
  }

  public async loadExport(file: File): Promise<{
    success: boolean;
    data?: any;
    error?: string;
  }> {
    try {
      if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
        throw new Error('Only JSON files are supported');
      }

      const text = await file.text();
      const data = JSON.parse(text);
      
      // Validate the export structure
      if (!this.isValidExport(data)) {
        throw new Error('Invalid export file format. Please use a file exported from DiscordChatExporter.');
      }

      const exportId = `export_${Date.now()}`;
      this.loadedExports.set(exportId, data);

      // Extract proper names from the export data
      const guildName = data.guild?.name || data.metadata?.guildName || 'Unknown Server';
      const channelName = data.channel?.name || data.metadata?.channelName || 'Unknown Channel';
      const exportName = data.metadata?.exportName || `${guildName} - ${channelName}`;

      return {
        success: true,
        data: {
          id: exportId,
          metadata: data.metadata,
          messages: data.messages,
          channels: data.channels,
          guild: {
            ...data.guild,
            name: guildName
          },
          channel: {
            ...data.channel,
            name: channelName
          },
          exportName: exportName,
          messageCount: data.messages?.length || 0
        }
      };
    } catch (error) {
      console.error('Failed to load export:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to load export file'
      };
    }
  }

  public async searchMessages(exportId: string, query: string): Promise<DiscordMessage[]> {
    const exportData = this.loadedExports.get(exportId);
    if (!exportData) {
      throw new Error('Export not found');
    }

    const messages = exportData.messages || [];
    if (!query.trim()) {
      return messages;
    }

    const searchTerm = query.toLowerCase();
    return messages.filter((message: DiscordMessage) => 
      message.content.toLowerCase().includes(searchTerm) ||
      message.author.name.toLowerCase().includes(searchTerm) ||
      (message.attachments && message.attachments.some(att => 
        att.fileName.toLowerCase().includes(searchTerm)
      ))
    );
  }

  public async getMessagesByChannel(
    exportId: string, 
    channelId: string, 
    limit: number = 50,
    before?: string
  ): Promise<DiscordMessage[]> {
    const exportData = this.loadedExports.get(exportId);
    if (!exportData) {
      throw new Error('Export not found');
    }

    let messages = exportData.messages || [];
    
    // Filter by channel if specified
    if (channelId && channelId !== 'all') {
      messages = messages.filter((msg: DiscordMessage) => 
        msg.channelId === channelId
      );
    }

    // Sort by timestamp (newest first)
    messages.sort((a: DiscordMessage, b: DiscordMessage) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Apply pagination
    if (before) {
      const beforeIndex = messages.findIndex((msg: DiscordMessage) => msg.id === before);
      if (beforeIndex !== -1) {
        messages = messages.slice(beforeIndex + 1);
      }
    }

    return messages.slice(0, limit);
  }

  public async getExportMetadata(exportId: string): Promise<any> {
    const exportData = this.loadedExports.get(exportId);
    if (!exportData) {
      throw new Error('Export not found');
    }

    return exportData.metadata || {};
  }

  public async getChannels(exportId: string): Promise<DiscordChannel[]> {
    const exportData = this.loadedExports.get(exportId);
    if (!exportData) {
      throw new Error('Export not found');
    }

    return exportData.channels || [];
  }

  public async getGuild(exportId: string): Promise<DiscordGuild | null> {
    const exportData = this.loadedExports.get(exportId);
    if (!exportData) {
      throw new Error('Export not found');
    }

    return exportData.guild || null;
  }

  public getLoadedExports(): string[] {
    return Array.from(this.loadedExports.keys());
  }

  public removeExport(exportId: string): boolean {
    return this.loadedExports.delete(exportId);
  }

  public clearExports(): void {
    this.loadedExports.clear();
  }

  public getExportStats(exportId: string): {
    totalMessages: number;
    totalChannels: number;
    dateRange: { start: string; end: string };
    uniqueUsers: number;
  } | null {
    const exportData = this.loadedExports.get(exportId);
    if (!exportData) {
      return null;
    }

    const messages = exportData.messages || [];
    const channels = exportData.channels || [];
    
    if (messages.length === 0) {
      return null;
    }

    const timestamps = messages.map((msg: DiscordMessage) => new Date(msg.timestamp).getTime());
    const uniqueUsers = new Set(messages.map((msg: DiscordMessage) => msg.author.id)).size;

    return {
      totalMessages: messages.length,
      totalChannels: channels.length,
      dateRange: {
        start: new Date(Math.min(...timestamps)).toISOString(),
        end: new Date(Math.max(...timestamps)).toISOString()
      },
      uniqueUsers
    };
  }

  private isValidExport(data: any): boolean {
    // Validate that this looks like a DiscordChatExporter export
    return (
      data &&
      typeof data === 'object' &&
      Array.isArray(data.messages) &&
      data.metadata &&
      typeof data.metadata === 'object' &&
      data.metadata.exportDate &&
      data.metadata.format
    );
  }

  // Generate sample data for demonstration purposes
  public generateSampleExport(): any {
    const sampleMessages: DiscordMessage[] = [
      {
        id: '1',
        type: 0,
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        content: 'Hello everyone! Welcome to the server! 👋',
        author: {
          id: 'user1',
          name: 'ServerAdmin',
          discriminator: '0001',
          isBot: false,
          avatarUrl: 'https://via.placeholder.com/32/5865F2/FFFFFF?text=SA'
        },
        attachments: [],
        embeds: [],
        stickers: [],
        reactions: [],
        mentions: [],
        mentionRoles: [],
        mentionChannels: [],
        isPinned: false,
        isTTS: false,
        flags: 0,
        hasThread: false,
        components: [],
        channelId: '1'
      },
      {
        id: '2',
        type: 0,
        timestamp: new Date(Date.now() - 3000000).toISOString(),
        content: 'Thanks for having me here! 😊',
        author: {
          id: 'user2',
          name: 'NewMember',
          discriminator: '0002',
          isBot: false,
          avatarUrl: 'https://via.placeholder.com/32/43B581/FFFFFF?text=NM'
        },
        attachments: [],
        embeds: [],
        stickers: [],
        reactions: [],
        mentions: [],
        mentionRoles: [],
        mentionChannels: [],
        isPinned: false,
        isTTS: false,
        flags: 0,
        hasThread: false,
        components: [],
        channelId: '1'
      },
      {
        id: '3',
        type: 0,
        timestamp: new Date(Date.now() - 2400000).toISOString(),
        content: 'How is everyone doing today?',
        author: {
          id: 'user3',
          name: 'RegularUser',
          discriminator: '0003',
          isBot: false,
          avatarUrl: 'https://via.placeholder.com/32/FAA61A/FFFFFF?text=RU'
        },
        attachments: [],
        embeds: [],
        stickers: [],
        reactions: [],
        mentions: [],
        mentionRoles: [],
        mentionChannels: [],
        isPinned: false,
        isTTS: false,
        flags: 0,
        hasThread: false,
        components: [],
        channelId: '1'
      }
    ];

    return {
      metadata: {
        exportDate: new Date().toISOString(),
        version: '1.0.0',
        format: 'Json',
        media: true,
        reuseMedia: true,
        markdown: false,
        includeThreads: 'All'
      },
      messages: sampleMessages,
      channels: [
        {
          id: '1',
          type: 0,
          name: 'general',
          topic: 'General discussion',
          position: 0,
          isNsfw: false,
          rateLimitPerUser: 0,
          messageCount: 3,
          threadCount: 0,
          flags: 0,
          totalMessageSent: 3,
          availableTags: [],
          appliedTags: [],
          defaultForumLayout: 0
        }
      ],
      guild: {
        id: '1',
        name: 'Sample Server',
        iconUrl: 'https://via.placeholder.com/128/5865F2/FFFFFF?text=SS',
        description: 'A sample server for demonstration',
        features: ['ANIMATED_ICON'],
        verificationLevel: 1,
        explicitContentFilter: 0,
        defaultMessageNotifications: 0,
        mfaLevel: 0,
        systemChannelFlags: 0,
        nsfwLevel: 0,
        stickers: [],
        premiumProgressBarEnabled: false,
        preferredLocale: 'en-US'
      }
    };
  }
}

export default ChatViewerService.getInstance();
