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
export * from './core/channelPosts.api';
export * from './core/showChannels.api';

// ─── Ai ───────────────────────────────────────────────────────────────────────
export * from './ai/aiImages.api';
export * from './ai/aiScripts.api';
export * from './ai/aiVideos.api';
export * from './ai/copilot.api';
export * from './ai/media.api';

// ─── Infra ────────────────────────────────────────────────────────────────────
export * from './infra/userProfiles.api';
export * from './infra/userSubscription.api';
export * from './infra/subscriptionPlans.api';
export * from './infra/notifications.api';
