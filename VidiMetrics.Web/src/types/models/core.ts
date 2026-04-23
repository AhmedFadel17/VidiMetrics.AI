import { BaseEntity } from "./base";
import { YouTubePrivacyStatus } from "../enums";

// ─── Video (abstract base) ───────────────────────────────────────────────────
export interface Video extends BaseEntity {
  title: string;
  description?: string;
  duration: string; // TimeSpan serialised as "hh:mm:ss"
  thumbnailUrl?: string;
  currentRank: number;
  lastRankCheck?: string;
  channelId: string;
}

// ─── YouTubeVideo ─────────────────────────────────────────────────────────────
export interface YouTubeVideo extends Video {
  youTubeVideoId: string;
  viewCount: number;
  likeCount: number;
  publishedAt: string;
  privacyStatus?: YouTubePrivacyStatus;
}

// ─── LocalVideo ───────────────────────────────────────────────────────────────
export interface LocalVideo extends Video {
  storageUrl: string;
  fileExtension: string;
  fileSizeInBytes: number;
  isProcessedByAi: boolean;
  processingError?: string;
}

// ─── Channel ──────────────────────────────────────────────────────────────────
export interface Channel extends BaseEntity {
  name: string;
  youTubeChannelId?: string;
  description?: string;
  customUrl?: string;
  videos?: Video[];
  playlists?: Playlist[];
}

// ─── Playlist ─────────────────────────────────────────────────────────────────
export interface Playlist extends BaseEntity {
  title: string;
  description?: string;
  youTubePlaylistId?: string;
  channelId: string;
  playlistItems?: PlaylistItem[];
}

// ─── PlaylistItem ─────────────────────────────────────────────────────────────
export interface PlaylistItem extends BaseEntity {
  position: number;
  note?: string;
  playlistId: string;
  videoId: string;
}
