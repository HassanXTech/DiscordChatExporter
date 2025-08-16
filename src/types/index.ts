export interface DiscordMessage {
  id: string;
  type: number;
  timestamp: string;
  timestampEdited?: string;
  callEndedTimestamp?: string;
  isPinned: boolean;
  content: string;
  author: DiscordAuthor;
  attachments: DiscordAttachment[];
  embeds: DiscordEmbed[];
  stickers: DiscordSticker[];
  reactions: DiscordReaction[];
  mentions: DiscordMention[];
  mentionRoles: string[];
  mentionChannels: DiscordMentionChannel[];
  isTTS: boolean;
  flags: number;
  hasThread: boolean;
  threadId?: string;
  thread?: DiscordThread;
  messageReference?: DiscordMessageReference;
  referencedMessage?: DiscordMessage;
  interaction?: DiscordInteraction;
  components: DiscordComponent[];
  applicationId?: string;
  activity?: DiscordActivity;
  channelId?: string;
  isEdited?: boolean;
  isDeleted?: boolean;
}

export interface DiscordAuthor {
  id: string;
  name: string;
  discriminator: string;
  nickname?: string;
  isBot: boolean;
  avatarUrl?: string;
  color?: string;
  status?: 'online' | 'idle' | 'dnd' | 'offline';
  customStatus?: string;
  isStreaming?: boolean;
  isPlaying?: boolean;
  gameName?: string;
}

export interface DiscordAttachment {
  id: string;
  url: string;
  fileName: string;
  fileSizeBytes: number;
  width?: number;
  height?: number;
  description?: string;
  isSpoiler: boolean;
  contentType?: string;
  isImage?: boolean;
  isVideo?: boolean;
  isAudio?: boolean;
}

export interface DiscordEmbed {
  title?: string;
  description?: string;
  url?: string;
  timestamp?: string;
  color?: number;
  footer?: DiscordEmbedFooter;
  image?: DiscordEmbedImage;
  thumbnail?: DiscordEmbedThumbnail;
  author?: DiscordEmbedAuthor;
  fields: DiscordEmbedField[];
}

export interface DiscordEmbedFooter {
  text: string;
  iconUrl?: string;
}

export interface DiscordEmbedImage {
  url: string;
  width?: number;
  height?: number;
}

export interface DiscordEmbedThumbnail {
  url: string;
  width?: number;
  height?: number;
}

export interface DiscordEmbedAuthor {
  name: string;
  url?: string;
  iconUrl?: string;
}

export interface DiscordEmbedField {
  name: string;
  value: string;
  inline: boolean;
}

export interface DiscordSticker {
  id: string;
  name: string;
  format: number;
}

export interface DiscordReaction {
  emoji: DiscordEmoji;
  count: number;
  hasReactedWith: boolean;
}

export interface DiscordEmoji {
  id?: string;
  name: string;
  isAnimated: boolean;
  imageUrl?: string;
}

export interface DiscordMention {
  id: string;
  name: string;
  discriminator: string;
  nickname?: string;
  isBot: boolean;
  avatarUrl?: string;
}

export interface DiscordMentionChannel {
  id: string;
  name: string;
  type: number;
}

export interface DiscordThread {
  id: string;
  name: string;
  messageCount: number;
  memberCount: number;
  isArchived: boolean;
  autoArchiveDuration: number;
  archiveTimestamp: string;
  locked: boolean;
  invitable: boolean;
  createdAt: string;
}

export interface DiscordMessageReference {
  messageId?: string;
  channelId?: string;
  guildId?: string;
  failIfNotExists?: boolean;
}

export interface DiscordInteraction {
  id: string;
  type: number;
  name: string;
  user: DiscordAuthor;
}

export interface DiscordComponent {
  type: number;
  customId?: string;
  disabled?: boolean;
  style?: number;
  label?: string;
  emoji?: DiscordEmoji;
  url?: string;
  options?: DiscordSelectOption[];
  placeholder?: string;
  minValues?: number;
  maxValues?: number;
  components?: DiscordComponent[];
}

export interface DiscordSelectOption {
  label: string;
  value: string;
  description?: string;
  emoji?: DiscordEmoji;
  default?: boolean;
}

export interface DiscordActivity {
  type: number;
  partyId?: string;
}

export interface DiscordChannel {
  id: string;
  type: number;
  categoryId?: string;
  category?: string;
  name: string;
  topic?: string;
  position: number;
  isNsfw: boolean;
  lastMessageId?: string;
  lastMessageTimestamp?: string;
  rateLimitPerUser: number;
  iconUrl?: string;
  ownerId?: string;
  applicationId?: string;
  parentId?: string;
  parent?: DiscordChannel;
  messageCount: number;
  threadCount: number;
  memberCount?: number;
  threadMetadata?: DiscordThreadMetadata;
  defaultAutoArchiveDuration?: number;
  flags: number;
  totalMessageSent: number;
  availableTags: DiscordForumTag[];
  appliedTags: string[];
  defaultReactionEmoji?: DiscordEmoji;
  defaultThreadRateLimitPerUser?: number;
  defaultSortOrder?: number;
  defaultForumLayout: number;
  isVoice?: boolean;
  isCategory?: boolean;
  isText?: boolean;
  isAnnouncement?: boolean;
  isStage?: boolean;
  isForum?: boolean;
  bitrate?: number;
  userLimit?: number;
  rtcRegion?: string;
  videoQualityMode?: number;
  lastPinTimestamp?: string;
  permissions?: string;
  overwrites?: any[];
}

export interface DiscordThreadMetadata {
  isArchived: boolean;
  autoArchiveDuration: number;
  archiveTimestamp: string;
  locked: boolean;
  invitable: boolean;
  createdAt: string;
}

export interface DiscordForumTag {
  id: string;
  name: string;
  moderated: boolean;
  emojiId?: string;
  emojiName?: string;
}

export interface DiscordGuild {
  id: string;
  name: string;
  iconUrl?: string;
  description?: string;
  bannerUrl?: string;
  features: string[];
  verificationLevel: number;
  explicitContentFilter: number;
  defaultMessageNotifications: number;
  mfaLevel: number;
  applicationId?: string;
  systemChannelId?: string;
  systemChannelFlags: number;
  rulesChannelId?: string;
  maxPresences?: number;
  maxMembers?: number;
  vanityUrlCode?: string;
  premiumTier?: number;
  premiumSubscriptionCount?: number;
  preferredLocale: string;
  publicUpdatesChannelId?: string;
  maxVideoChannelUsers?: number;
  maxStageVideoChannelUsers?: number;
  approximateMemberCount?: number;
  approximatePresenceCount?: number;
  welcomeScreen?: DiscordWelcomeScreen;
  nsfwLevel: number;
  stickers: DiscordSticker[];
  premiumProgressBarEnabled: boolean;
  isOwner?: boolean;
  permissions?: string;
  joinedAt?: string;
}

export interface DiscordWelcomeScreen {
  description?: string;
  welcomeChannels: DiscordWelcomeChannel[];
}

export interface DiscordWelcomeChannel {
  channelId: string;
  description: string;
  emojiId?: string;
  emojiName?: string;
}

export interface DiscordDMChannel {
  id: string;
  type: number;
  lastMessageId?: string;
  lastMessageTimestamp?: number;
  recipients: DiscordAuthor[];
  isGroup?: boolean;
  name?: string;
  iconUrl?: string;
  ownerId?: string;
  messageCount: number;
  totalMessageSent: number;
}

export interface DiscordExportOptions {
  token: string;
  channelId?: string;
  guildId?: string;
  after?: string;
  before?: string;
  limit?: number;
  format: 'Json' | 'Html' | 'Csv' | 'Txt';
  media?: boolean;
  reuseMedia?: boolean;
  markdown?: boolean;
  includeThreads?: 'None' | 'All' | 'Only';
  outputPath: string;
}

export interface DiscordExportResult {
  success: boolean;
  message?: string;
  filePath?: string;
  error?: string;
}

export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatarUrl?: string;
  isBot: boolean;
  isSystem: boolean;
  locale?: string;
  flags?: number;
  premiumType?: number;
  publicFlags?: number;
  bannerUrl?: string;
  accentColor?: number;
  globalName?: string;
  avatarDecorationUrl?: string;
  displayName?: string;
  banner?: string;
  accentColorHex?: string;
}

export interface DiscordVoiceState {
  userId: string;
  channelId?: string;
  guildId?: string;
  isDeaf: boolean;
  isMute: boolean;
  isSelfDeaf: boolean;
  isSelfMute: boolean;
  isStreaming: boolean;
  isVideo: boolean;
  isSuppressed: boolean;
  requestToSpeakTimestamp?: string;
  sessionId: string;
}

export interface DiscordPresence {
  userId: string;
  guildId?: string;
  status: 'online' | 'idle' | 'dnd' | 'offline';
  activities: DiscordActivity[];
  clientStatus: {
    desktop?: string;
    mobile?: string;
    web?: string;
  };
}

export interface DiscordRole {
  id: string;
  name: string;
  color: number;
  isHoist: boolean;
  isManaged: boolean;
  isMentionable: boolean;
  permissions: string;
  position: number;
  iconUrl?: string;
  unicodeEmoji?: string;
  tags?: any;
}

export interface DiscordMember {
  user: DiscordUser;
  nick?: string;
  avatarUrl?: string;
  roles: string[];
  joinedAt: string;
  premiumSince?: string;
  isDeaf: boolean;
  isMute: boolean;
  isPending?: boolean;
  permissions?: string;
  communicationDisabledUntil?: string;
}

export interface DiscordInvite {
  code: string;
  guildId?: string;
  channelId: string;
  inviter?: DiscordUser;
  targetType?: number;
  targetUser?: DiscordUser;
  targetApplication?: any;
  approximatePresenceCount?: number;
  approximateMemberCount?: number;
  expiresAt?: string;
  stageInstance?: any;
  guild?: DiscordGuild;
  channel?: DiscordChannel;
  uses: number;
  maxUses: number;
  maxAge: number;
  isTemporary: boolean;
  createdAt: string;
}

export interface DiscordWebhook {
  id: string;
  type: number;
  guildId?: string;
  channelId: string;
  name?: string;
  avatarUrl?: string;
  token?: string;
  applicationId?: string;
  sourceGuild?: DiscordGuild;
  sourceChannel?: DiscordChannel;
  url?: string;
}

export interface DiscordAuditLog {
  auditLogEntries: DiscordAuditLogEntry[];
  users: DiscordUser[];
  webhooks: DiscordWebhook[];
  guildScheduledEvents: any[];
  integrations: any[];
  threads: DiscordThread[];
  applicationCommands: any[];
}

export interface DiscordAuditLogEntry {
  id: string;
  targetId?: string;
  changes: any[];
  userId?: string;
  actionType: number;
  options?: any;
  reason?: string;
}

export interface DiscordIntegration {
  id: string;
  name: string;
  type: string;
  isEnabled: boolean;
  isSyncing?: boolean;
  roleId?: string;
  isEmoticonsEnabled?: boolean;
  expireBehavior?: number;
  expireGracePeriod?: number;
  user?: DiscordUser;
  account: any;
  syncedAt?: string;
  subscriberCount?: number;
  isRevoked?: boolean;
  application?: any;
  scopes: string[];
}

export interface DiscordTemplate {
  code: string;
  name: string;
  description?: string;
  usageCount: number;
  creatorId: string;
  creator: DiscordUser;
  createdAt: string;
  updatedAt: string;
  guildId: string;
  guild: DiscordGuild;
  isDirty?: boolean;
}

export interface DiscordWidget {
  id: string;
  name: string;
  instantInvite?: string;
  channels: DiscordChannel[];
  members: DiscordUser[];
  presenceCount: number;
}

export interface DiscordWidgetSettings {
  enabled: boolean;
  channelId?: string;
}

export interface DiscordWelcomeScreenSettings {
  enabled: boolean;
  welcomeChannels: DiscordWelcomeChannel[];
  description?: string;
}

export interface DiscordGuildPreview {
  id: string;
  name: string;
  iconUrl?: string;
  splashUrl?: string;
  discoverySplashUrl?: string;
  emojis: any[];
  features: string[];
  approximateMemberCount: number;
  approximatePresenceCount: number;
  description?: string;
  stickers: any[];
}

export interface DiscordGuildWidget {
  id: string;
  name: string;
  instantInvite?: string;
  channels: DiscordChannel[];
  members: DiscordUser[];
  presenceCount: number;
}

export interface DiscordGuildWidgetSettings {
  enabled: boolean;
  channelId?: string;
}

export interface DiscordGuildMember {
  user: DiscordUser;
  nick?: string;
  avatarUrl?: string;
  roles: string[];
  joinedAt: string;
  premiumSince?: string;
  isDeaf: boolean;
  isMute: boolean;
  isPending?: boolean;
  permissions?: string;
  communicationDisabledUntil?: string;
}

export interface DiscordGuildScheduledEvent {
  id: string;
  guildId: string;
  channelId?: string;
  creatorId: string;
  name: string;
  description?: string;
  scheduledStartTime: string;
  scheduledEndTime?: string;
  privacyLevel: number;
  status: number;
  entityType: number;
  entityId?: string;
  entityMetadata?: any;
  creator: DiscordUser;
  userCount?: number;
  imageUrl?: string;
}

export interface DiscordGuildScheduledEventUser {
  guildScheduledEventId: string;
  user: DiscordUser;
  member?: DiscordGuildMember;
}

export interface DiscordGuildScheduledEventEntityMetadata {
  location?: string;
}

export interface DiscordGuildScheduledEventEntityType {
  STAGE_INSTANCE: 1;
  VOICE: 2;
  EXTERNAL: 3;
}

export interface DiscordGuildScheduledEventPrivacyLevel {
  GUILD_ONLY: 1;
}

export interface DiscordGuildScheduledEventStatus {
  SCHEDULED: 1;
  ACTIVE: 2;
  COMPLETED: 3;
  CANCELED: 4;
}

export interface DiscordGuildScheduledEventEntityType {
  STAGE_INSTANCE: 1;
  VOICE: 2;
  EXTERNAL: 3;
}

export interface DiscordGuildScheduledEventPrivacyLevel {
  GUILD_ONLY: 1;
}

export interface DiscordGuildScheduledEventStatus {
  SCHEDULED: 1;
  ACTIVE: 2;
  COMPLETED: 3;
  CANCELED: 4;
}
