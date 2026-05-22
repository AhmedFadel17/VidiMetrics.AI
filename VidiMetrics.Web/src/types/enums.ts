
// ─── Core Enums ─────────────────────────────────────────────────────────────────
export enum ChannelPlatform {
  YouTube = 0,
  TikTok = 1,
  Instagram = 2,
  Facebook = 3,
  LinkedIn = 4,
  X = 5,
  Federated = 6,
}

export enum ChannelPostStatus {
  Draft = 0,
  Queued = 1,
  Published = 2,
  Failed = 3,
}

export enum AiTaskStatus {
  Pending = 0,
  Processing = 1,
  Completed = 2,
  Failed = 3,
  Cancelled = 4,
}

export enum ApiType {
  YouTube = 0,
  OpenAI = 1,
  ElevenLabs = 2,
  Anthropic = 3,
  VideoGeneration = 4,
  GoogleSearch = 5,
}

export enum ModelTarget {
  Gpt4o = 0,
  Gpt4oMini = 1,
  Gemini15Pro = 2,
  Gemini15Flash = 3,
  Claude35Sonnet = 4,
  CustomLlama3 = 5,
}

export enum SearchEngine {
  YouTube = 0,
  GoogleWeb = 1,
  GoogleVideos = 2,
  Bing = 3,
  TikTok = 4,
}

export enum ShowStatus {
  Draft = 0,
  InProduction = 1,
  Published = 2,
  Archived = 3,
}

export enum SubscriptionStatus {
  Active = 1,
  Expired = 2,
  Cancelled = 3,
}

export enum TargetPlatform {
  YouTubeShorts = 0,
  TikTok = 1,
  InstagramReels = 2,
  FacebookReels = 3,
  LinkedIn = 4,
  X = 5,
  Federated = 6,
}

export enum UserRole {
  User = 0,
  Admin = 1,
}

export enum YouTubePrivacyStatus {
  Public = 0,
  Unlisted = 1,
  Private = 2,
  Unknown = 3,
}

export enum ScriptLineType {
  Character = 0,
  ActionDescription = 1,
}
