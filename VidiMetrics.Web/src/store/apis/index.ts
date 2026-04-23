// ─── Base API ─────────────────────────────────────────────────────────────────
export { mainApi } from './mainApi';

// ─── StoryEngine ──────────────────────────────────────────────────────────────
export * from './storyEngine/shows.api';
export * from './storyEngine/characters.api';
export * from './storyEngine/episodes.api';
export * from './storyEngine/storyEnvironments.api';

// ─── Core ─────────────────────────────────────────────────────────────────────
export * from './core/channels.api';
export * from './core/videos.api';
export * from './core/playlists.api';
export * from './core/playlistItems.api';
export * from './core/localVideos.api';
export * from './core/youtubeVideos.api';

// ─── Ai ───────────────────────────────────────────────────────────────────────
export * from './ai/aiPromptTemplates.api';
export * from './ai/aiTasks.api';
export * from './ai/shortsProjects.api';
export * from './ai/transcripts.api';

// ─── Seo ──────────────────────────────────────────────────────────────────────
export * from './seo/competitorVideos.api';
export * from './seo/keywordRankings.api';
export * from './seo/keywords.api';
export * from './seo/seoAudits.api';
export * from './seo/videoTags.api';

// ─── Infra ────────────────────────────────────────────────────────────────────
export * from './infra/userProfiles.api';
export * from './infra/apiUsageQuotas.api';
