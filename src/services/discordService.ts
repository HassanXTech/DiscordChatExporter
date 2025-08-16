import { 
  DiscordExportOptions, 
  DiscordExportResult, 
  DiscordChannel, 
  DiscordGuild, 
  DiscordMessage, 
  DiscordDMChannel,
  DiscordUser,
  DiscordVoiceState,
  DiscordPresence,
  DiscordMember,
  DiscordRole
} from '../types';

// Real Discord API integration with full feature support
export class DiscordService {
  private static instance: DiscordService;
  private isAuthenticated = false;
  private token: string = '';
  private baseUrl = 'https://discord.com/api/v10';
  private currentUser: DiscordUser | null = null;

  public static getInstance(): DiscordService {
    if (!DiscordService.instance) {
      DiscordService.instance = new DiscordService();
    }
    return DiscordService.instance;
  }

  public async authenticate(token: string): Promise<boolean> {
    try {
      // Test the token by making a real API call
      const response = await fetch(`${this.baseUrl}/users/@me`, {
        headers: {
          'Authorization': token.startsWith('Bot ') ? token : token,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const userData = await response.json();
      this.currentUser = {
        id: userData.id,
        username: userData.username,
        discriminator: userData.discriminator || '0',
        avatarUrl: userData.avatar ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png` : undefined,
        isBot: userData.bot || false,
        isSystem: userData.system || false,
        locale: userData.locale,
        flags: userData.flags,
        premiumType: userData.premium_type,
        publicFlags: userData.public_flags,
        bannerUrl: userData.banner ? `https://cdn.discordapp.com/banners/${userData.id}/${userData.banner}.png` : undefined,
        accentColor: userData.accent_color,
        globalName: userData.global_name,
        avatarDecorationUrl: userData.avatar_decoration ? `https://cdn.discordapp.com/avatar-decorations/${userData.id}/${userData.avatar_decoration}.png` : undefined,
        displayName: userData.global_name || userData.username,
        banner: userData.banner,
        accentColorHex: userData.accent_color ? `#${userData.accent_color.toString(16).padStart(6, '0')}` : undefined
      };
      
      console.log('Authenticated as:', this.currentUser.username);
      
      this.token = token;
      this.isAuthenticated = true;
      return true;
    } catch (error) {
      console.error('Authentication failed:', error);
      return false;
    }
  }

  public async getCurrentUser(): Promise<DiscordUser | null> {
    return this.currentUser;
  }

  public async getGuilds(): Promise<DiscordGuild[]> {
    if (!this.isAuthenticated) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await fetch(`${this.baseUrl}/users/@me/guilds`, {
        headers: {
          'Authorization': this.token.startsWith('Bot ') ? this.token : this.token,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch guilds: ${response.status}`);
      }

      const guildsData = await response.json();
      
      return guildsData.map((guild: any) => ({
        id: guild.id,
        name: guild.name,
        iconUrl: guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` : undefined,
        description: guild.description || undefined,
        bannerUrl: guild.banner ? `https://cdn.discordapp.com/banners/${guild.id}/${guild.banner}.png` : undefined,
        features: guild.features || [],
        verificationLevel: guild.verification_level || 0,
        explicitContentFilter: guild.explicit_content_filter || 0,
        defaultMessageNotifications: guild.default_message_notifications || 0,
        mfaLevel: guild.mfa_level || 0,
        applicationId: guild.application_id || undefined,
        systemChannelId: guild.system_channel_id || undefined,
        systemChannelFlags: guild.system_channel_flags || 0,
        rulesChannelId: guild.rules_channel_id || undefined,
        maxPresences: guild.max_presences || undefined,
        maxMembers: guild.max_members || undefined,
        vanityUrlCode: guild.vanity_url_code || undefined,
        premiumTier: guild.premium_tier || 0,
        premiumSubscriptionCount: guild.premium_subscription_count || undefined,
        preferredLocale: guild.preferred_locale || 'en-US',
        publicUpdatesChannelId: guild.public_updates_channel_id || undefined,
        maxVideoChannelUsers: guild.max_video_channel_users || undefined,
        maxStageVideoChannelUsers: guild.max_stage_video_channel_users || undefined,
        approximateMemberCount: guild.approximate_member_count || undefined,
        approximatePresenceCount: guild.approximate_presence_count || undefined,
        nsfwLevel: guild.nsfw_level || 0,
        stickers: [],
        premiumProgressBarEnabled: guild.premium_progress_bar_enabled || false,
        isOwner: guild.owner || false,
        permissions: guild.permissions || undefined,
        joinedAt: guild.joined_at || undefined
      }));
    } catch (error) {
      console.error('Failed to fetch guilds:', error);
      throw error;
    }
  }

  public async getDMChannels(): Promise<DiscordDMChannel[]> {
    if (!this.isAuthenticated) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await fetch(`${this.baseUrl}/users/@me/channels`, {
        headers: {
          'Authorization': this.token.startsWith('Bot ') ? this.token : this.token,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch DM channels: ${response.status}`);
      }

      const channelsData = await response.json();
      
      // Filter for DM channels (type 1 for DMs, type 3 for group DMs)
      const dmChannels = channelsData.filter((channel: any) => channel.type === 1 || channel.type === 3);
      
      return dmChannels.map((channel: any) => ({
        id: channel.id,
        type: channel.type,
        lastMessageId: channel.last_message_id || undefined,
        lastMessageTimestamp: channel.last_message_id ? undefined : undefined, // We'll need to fetch this separately
        recipients: channel.recipients?.map((recipient: any) => ({
          id: recipient.id,
          name: recipient.username,
          discriminator: recipient.discriminator || '0',
          nickname: undefined,
          isBot: recipient.bot || false,
          avatarUrl: recipient.avatar ? `https://cdn.discordapp.com/avatars/${recipient.id}/${recipient.avatar}.png` : undefined,
          color: undefined,
          status: 'offline' // We'll need to fetch presence separately
        })) || [],
        isGroup: channel.type === 3,
        name: channel.name || undefined,
        iconUrl: channel.icon ? `https://cdn.discordapp.com/channel-icons/${channel.id}/${channel.icon}.png` : undefined,
        ownerId: channel.owner_id || undefined,
        messageCount: 0, // We'll need to fetch this separately
        totalMessageSent: 0 // We'll need to fetch this separately
      }));
    } catch (error) {
      console.error('Failed to fetch DM channels:', error);
      throw error;
    }
  }

  public async getChannels(guildId: string): Promise<DiscordChannel[]> {
    if (!this.isAuthenticated) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await fetch(`${this.baseUrl}/guilds/${guildId}/channels`, {
        headers: {
          'Authorization': this.token.startsWith('Bot ') ? this.token : this.token,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch channels: ${response.status}`);
      }

      const channelsData = await response.json();
      
      return channelsData.map((channel: any) => ({
        id: channel.id,
        type: channel.type,
        categoryId: channel.parent_id || undefined,
        category: undefined, // We'll need to fetch this separately if needed
        name: channel.name,
        topic: channel.topic || undefined,
        position: channel.position || 0,
        isNsfw: channel.nsfw || false,
        lastMessageId: channel.last_message_id || undefined,
        lastMessageTimestamp: undefined, // Not provided by Discord API
        rateLimitPerUser: channel.rate_limit_per_user || 0,
        iconUrl: undefined, // Text channels don't have icons
        ownerId: undefined,
        applicationId: undefined,
        parentId: channel.parent_id || undefined,
        parent: undefined,
        messageCount: 0, // Discord API doesn't provide this
        threadCount: 0, // We'll need to fetch threads separately
        memberCount: undefined,
        threadMetadata: undefined,
        defaultAutoArchiveDuration: channel.default_auto_archive_duration || undefined,
        flags: channel.flags || 0,
        totalMessageSent: 0, // Discord API doesn't provide this
        availableTags: [],
        appliedTags: [],
        defaultReactionEmoji: undefined,
        defaultThreadRateLimitPerUser: undefined,
        defaultSortOrder: undefined,
        defaultForumLayout: 0,
        isVoice: channel.type === 2,
        isCategory: channel.type === 4,
        isText: channel.type === 0,
        isAnnouncement: channel.type === 5,
        isStage: channel.type === 13,
        isForum: channel.type === 15,
        bitrate: channel.bitrate || undefined,
        userLimit: channel.user_limit || undefined,
        rtcRegion: channel.rtc_region || undefined,
        videoQualityMode: channel.video_quality_mode || undefined,
        lastPinTimestamp: channel.last_pin_timestamp || undefined,
        permissions: channel.permissions || undefined,
        overwrites: channel.permission_overwrites || []
      }));
    } catch (error) {
      console.error('Failed to fetch channels:', error);
      throw error;
    }
  }

  public async getThreads(guildId: string): Promise<any[]> {
    if (!this.isAuthenticated) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await fetch(`${this.baseUrl}/guilds/${guildId}/threads/active`, {
        headers: {
          'Authorization': this.token.startsWith('Bot ') ? this.token : this.token,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch threads: ${response.status}`);
      }

      const threadsData = await response.json();
      return threadsData.threads || [];
    } catch (error) {
      console.error('Failed to fetch threads:', error);
      return [];
    }
  }

  public async getGuildMembers(guildId: string): Promise<DiscordMember[]> {
    if (!this.isAuthenticated) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await fetch(`${this.baseUrl}/guilds/${guildId}/members?limit=1000`, {
        headers: {
          'Authorization': this.token.startsWith('Bot ') ? this.token : this.token,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch guild members: ${response.status}`);
      }

      const membersData = await response.json();
      
      return membersData.map((member: any) => ({
        user: {
          id: member.user.id,
          username: member.user.username,
          discriminator: member.user.discriminator || '0',
          avatarUrl: member.user.avatar ? `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png` : undefined,
          isBot: member.user.bot || false,
          isSystem: member.user.system || false,
          locale: member.user.locale,
          flags: member.user.flags,
          premiumType: member.user.premium_type,
          publicFlags: member.user.public_flags,
          bannerUrl: member.user.banner ? `https://cdn.discordapp.com/banners/${member.user.id}/${member.user.banner}.png` : undefined,
          accentColor: member.user.accent_color,
          globalName: member.user.global_name,
          avatarDecorationUrl: member.user.avatar_decoration ? `https://cdn.discordapp.com/avatar-decorations/${member.user.id}/${member.user.avatar_decoration}.png` : undefined,
          displayName: member.user.global_name || member.user.username,
          banner: member.user.banner,
          accentColorHex: member.user.accent_color ? `#${member.user.accent_color.toString(16).padStart(6, '0')}` : undefined
        },
        nick: member.nick || undefined,
        avatarUrl: member.avatar ? `https://cdn.discordapp.com/guilds/${guildId}/users/${member.user.id}/avatars/${member.avatar}.png` : undefined,
        roles: member.roles || [],
        joinedAt: member.joined_at,
        premiumSince: member.premium_since || undefined,
        isDeaf: member.deaf || false,
        isMute: member.mute || false,
        isPending: member.pending || false,
        permissions: member.permissions || undefined,
        communicationDisabledUntil: member.communication_disabled_until || undefined
      }));
    } catch (error) {
      console.error('Failed to fetch guild members:', error);
      throw error;
    }
  }

  public async getGuildRoles(guildId: string): Promise<DiscordRole[]> {
    if (!this.isAuthenticated) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await fetch(`${this.baseUrl}/guilds/${guildId}/roles`, {
        headers: {
          'Authorization': this.token.startsWith('Bot ') ? this.token : this.token,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch guild roles: ${response.status}`);
      }

      const rolesData = await response.json();
      
      return rolesData.map((role: any) => ({
        id: role.id,
        name: role.name,
        color: role.color,
        isHoist: role.hoist || false,
        isManaged: role.managed || false,
        isMentionable: role.mentionable || false,
        permissions: role.permissions,
        position: role.position,
        iconUrl: role.icon ? `https://cdn.discordapp.com/role-icons/${role.id}/${role.icon}.png` : undefined,
        unicodeEmoji: role.unicode_emoji || undefined,
        tags: role.tags || {}
      }));
    } catch (error) {
      console.error('Failed to fetch guild roles:', error);
      throw error;
    }
  }

  public async exportChannel(options: DiscordExportOptions): Promise<DiscordExportResult> {
    if (!this.isAuthenticated) {
      throw new Error('Not authenticated');
    }

    try {
      if (!options.channelId) {
        throw new Error('Channel ID is required for channel export');
      }
      
      console.log('Starting export for channel:', options.channelId);
      
      // Fetch messages from the channel
      const messages = await this.fetchChannelMessages(options.channelId, options.limit || 100);
      
      // Create export data structure
      const exportData = {
        metadata: {
          exportDate: new Date().toISOString(),
          version: '1.0.0',
          format: options.format,
          media: options.media || false,
          reuseMedia: options.reuseMedia || false,
          markdown: options.markdown || false,
          includeThreads: options.includeThreads || 'None'
        },
        messages: messages,
        channels: [{
          id: options.channelId,
          type: 0,
          name: 'exported-channel',
          topic: undefined,
          position: 0,
          isNsfw: false,
          rateLimitPerUser: 0,
          messageCount: messages.length,
          threadCount: 0,
          flags: 0,
          totalMessageSent: messages.length,
          availableTags: [],
          appliedTags: [],
          defaultForumLayout: 0
        }],
        guild: {
          id: options.guildId || 'unknown',
          name: 'Exported Guild',
          iconUrl: undefined,
          description: undefined,
          bannerUrl: undefined,
          features: [],
          verificationLevel: 0,
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

      // Convert to JSON and create downloadable file
      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const a = document.createElement('a');
      a.href = url;
      a.download = `discord-export-${options.channelId}-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      return {
        success: true,
        message: 'Export completed successfully',
        filePath: a.download
      };
    } catch (error) {
      console.error('Export failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  public async exportDMChannel(options: DiscordExportOptions): Promise<DiscordExportResult> {
    if (!this.isAuthenticated) {
      throw new Error('Not authenticated');
    }

    try {
      if (!options.channelId) {
        throw new Error('Channel ID is required for DM export');
      }
      
      console.log('Starting export for DM channel:', options.channelId);
      
      // Fetch messages from the DM channel
      const messages = await this.fetchChannelMessages(options.channelId, options.limit || 100);
      
      // Create export data structure for DM
      const exportData = {
        metadata: {
          exportDate: new Date().toISOString(),
          version: '1.0.0',
          format: options.format,
          media: options.media || false,
          reuseMedia: options.reuseMedia || false,
          markdown: options.markdown || false,
          includeThreads: options.includeThreads || 'None',
          type: 'DM'
        },
        messages: messages,
        channel: {
          id: options.channelId,
          type: 1, // DM channel
          name: 'Direct Message',
          messageCount: messages.length,
          totalMessageSent: messages.length
        },
        recipients: [] // We'll need to fetch this separately
      };

      // Convert to JSON and create downloadable file
      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const a = document.createElement('a');
      a.href = url;
      a.download = `discord-dm-export-${options.channelId}-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      return {
        success: true,
        message: 'DM export completed successfully',
        filePath: a.download
      };
    } catch (error) {
      console.error('DM export failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  public async fetchChannelMessages(channelId: string, limit: number = 100, before?: string): Promise<DiscordMessage[]> {
    const messages: DiscordMessage[] = [];
    let lastMessageId: string | undefined = before;

    try {
      while (messages.length < limit) {
        const url = new URL(`${this.baseUrl}/channels/${channelId}/messages`);
        url.searchParams.set('limit', '100'); // Discord API max per request
        
        if (lastMessageId) {
          url.searchParams.set('before', lastMessageId);
        }

        const response = await fetch(url.toString(), {
          headers: {
            'Authorization': this.token.startsWith('Bot ') ? this.token : this.token,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch messages: ${response.status}`);
        }

        const messagesData = await response.json();
        
        if (messagesData.length === 0) {
          break; // No more messages
        }

        const convertedMessages = messagesData.map((msg: any) => ({
          id: msg.id,
          type: msg.type,
          timestamp: msg.timestamp,
          timestampEdited: msg.edited_timestamp || undefined,
          callEndedTimestamp: undefined,
          isPinned: msg.pinned || false,
          content: msg.content,
          author: {
            id: msg.author.id,
            name: msg.author.username,
            discriminator: msg.author.discriminator || '0',
            nickname: undefined,
            isBot: msg.author.bot || false,
            avatarUrl: msg.author.avatar ? `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.png` : undefined,
            color: undefined,
            status: 'offline' // We'll need to fetch presence separately
          },
          attachments: msg.attachments?.map((att: any) => ({
            id: att.id,
            url: att.url,
            fileName: att.filename,
            fileSizeBytes: att.size,
            width: att.width,
            height: att.height,
            description: undefined,
            isSpoiler: att.filename.startsWith('SPOILER_'),
            contentType: att.content_type,
            isImage: att.content_type?.startsWith('image/') || false,
            isVideo: att.content_type?.startsWith('video/') || false,
            isAudio: att.content_type?.startsWith('audio/') || false
          })) || [],
          embeds: msg.embeds?.map((embed: any) => ({
            title: embed.title,
            description: embed.description,
            url: embed.url,
            timestamp: embed.timestamp,
            color: embed.color,
            footer: embed.footer ? {
              text: embed.footer.text,
              iconUrl: embed.footer.icon_url
            } : undefined,
            image: embed.image ? {
              url: embed.image.url,
              width: embed.image.width,
              height: embed.image.height
            } : undefined,
            thumbnail: embed.thumbnail ? {
              url: embed.thumbnail.url,
              width: embed.thumbnail.width,
              height: embed.thumbnail.height
            } : undefined,
            author: embed.author ? {
              name: embed.author.name,
              url: embed.author.url,
              iconUrl: embed.author.icon_url
            } : undefined,
            fields: embed.fields?.map((field: any) => ({
              name: field.name,
              value: field.value,
              inline: field.inline || false
            })) || []
          })) || [],
          stickers: [],
          reactions: msg.reactions?.map((reaction: any) => ({
            emoji: {
              id: reaction.emoji.id,
              name: reaction.emoji.name,
              isAnimated: reaction.emoji.animated || false,
              imageUrl: reaction.emoji.id ? `https://cdn.discordapp.com/emojis/${reaction.emoji.id}.png` : undefined
            },
            count: reaction.count,
            hasReactedWith: reaction.me || false
          })) || [],
          mentions: msg.mentions?.map((mention: any) => ({
            id: mention.id,
            name: mention.username,
            discriminator: mention.discriminator || '0',
            nickname: undefined,
            isBot: mention.bot || false,
            avatarUrl: mention.avatar ? `https://cdn.discordapp.com/avatars/${mention.id}/${mention.avatar}.png` : undefined
          })) || [],
          mentionRoles: msg.mention_roles || [],
          mentionChannels: [],
          isTTS: msg.tts || false,
          flags: msg.flags || 0,
          hasThread: msg.thread_id ? true : false,
          threadId: msg.thread_id || undefined,
          thread: undefined,
          messageReference: msg.referenced_message ? {
            messageId: msg.referenced_message.id,
            channelId: msg.referenced_message.channel_id,
            guildId: msg.referenced_message.guild_id
          } : undefined,
          referencedMessage: undefined,
          interaction: undefined,
          components: [],
          applicationId: msg.application_id || undefined,
          activity: undefined,
          channelId: channelId,
          isEdited: !!msg.edited_timestamp,
          isDeleted: false
        }));

        messages.push(...convertedMessages);
        
        if (messagesData.length < 100) {
          break; // Last page
        }
        
        lastMessageId = messagesData[messagesData.length - 1].id;
        
        // Rate limiting - be respectful
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      return messages.slice(0, limit);
    } catch (error) {
      console.error('Failed to fetch channel messages:', error);
      throw error;
    }
  }

  public async exportGuild(options: DiscordExportOptions): Promise<DiscordExportResult> {
    if (!this.isAuthenticated) {
      throw new Error('Not authenticated');
    }

    try {
      if (!options.guildId) {
        throw new Error('Guild ID is required for guild export');
      }
      const channels = await this.getChannels(options.guildId);
      const allMessages: DiscordMessage[] = [];

      // Export each channel
      for (const channel of channels) {
        try {
          const messages = await this.fetchChannelMessages(channel.id, options.limit || 1000);
          allMessages.push(...messages);
          
          // Rate limiting
          await new Promise(resolve => setTimeout(resolve, 200));
        } catch (error) {
          console.error(`Failed to export channel ${channel.name}:`, error);
        }
      }

      // Create export data structure
      const exportData = {
        metadata: {
          exportDate: new Date().toISOString(),
          version: '1.0.0',
          format: options.format,
          media: options.media || false,
          reuseMedia: options.reuseMedia || false,
          markdown: options.markdown || false,
          includeThreads: options.includeThreads || 'All'
        },
        messages: allMessages,
        channels: channels,
        guild: {
          id: options.guildId || 'unknown',
          name: 'Exported Guild',
          iconUrl: undefined,
          description: undefined,
          bannerUrl: undefined,
          features: [],
          verificationLevel: 0,
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

      // Convert to JSON and create downloadable file
      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const a = document.createElement('a');
      a.href = url;
      a.download = `discord-guild-export-${options.guildId}-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      return {
        success: true,
        message: 'Guild export completed successfully',
        filePath: a.download
      };
    } catch (error) {
      console.error('Guild export failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  public isTokenValid(token: string): boolean {
    // Basic token validation (Discord tokens are typically 59-83 characters long)
    return token.length >= 50 && token.length <= 100;
  }

  public getAuthStatus(): boolean {
    return this.isAuthenticated;
  }

  public logout(): void {
    this.isAuthenticated = false;
    this.token = '';
    this.currentUser = null;
  }
}

export default DiscordService.getInstance();
