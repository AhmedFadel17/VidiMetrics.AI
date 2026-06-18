// ─── Base API ─────────────────────────────────────────────────────────────────
export { mainApi } from './mainApi';

// ─── StoryEngine ──────────────────────────────────────────────────────────────
export * from './storyEngine/shows.api';
export * from './storyEngine/characters.api';
export * from './storyEngine/episodes.api';
export * from './storyEngine/scenes.api';
export * from './storyEngine/locations.api';

// ─── Core ─────────────────────────────────────────────────────────────────────
export * from './core/channels.api';
export * from './core/videos.api';
export * from './core/channelPosts.api';
export * from './core/showChannels.api';

// ─── Ai ───────────────────────────────────────────────────────────────────────
export * from './ai/aiPromptTemplates.api';
export * from './ai/aiTasks.api';
export * from './ai/aiImages.api';
export * from './ai/aiScripts.api';
export * from './ai/aiVideos.api';
export * from './ai/transcripts.api';
export * from './ai/copilot.api';
export * from './ai/media.api';

// ─── Seo ──────────────────────────────────────────────────────────────────────
export * from './seo/competitorVideos.api';
export * from './seo/keywordRankings.api';
export * from './seo/keywords.api';
export * from './seo/seoAudits.api';
export * from './seo/videoTags.api';

// ─── Infra ────────────────────────────────────────────────────────────────────
export * from './infra/userProfiles.api';
export * from './infra/userSubscription.api';
export * from './infra/subscriptionPlans.api';
export * from './infra/notifications.api';
