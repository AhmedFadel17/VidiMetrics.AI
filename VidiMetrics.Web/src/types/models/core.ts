import { ChannelPlatform, ChannelPostStatus } from "../enums";
import { BaseEntity } from "./base";

// ─── Video (abstract base) ───────────────────────────────────────────────────
export interface Video extends BaseEntity {
  title: string;
  description?: string;
  duration: string;
  thumbnailUrl?: string;
  currentRank: number;
  lastRankCheck?: string;
  channelId: string;
}


// ─── Channel ──────────────────────────────────────────────────────────────────
export interface Channel extends BaseEntity {
  name: string;
  avatarUrl: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  isActive: boolean;
  isConnected: boolean;
  syncAnalytics: boolean;
  autoPost: boolean;
  platform?: ChannelPlatform;
  platformChannelId: string;
  channelPosts?: ChannelPost[];
  channelStat?: ChannelStat;
}

// ─── ChannelPost ─────────────────────────────────────────────────────────────────
export interface ChannelPost extends BaseEntity {
  title: string;
  description?: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  publishedAt?: string;
  scheduledAt?: string;
  externalPostId?: string;
  status?: ChannelPostStatus;
  errorMessage?: string;
  channelId: string;
}

// ─── ChannelStat ─────────────────────────────────────────────────────────────────
export interface ChannelStat extends BaseEntity {
  totalViews: number;
  totalSubscribers: number;
  totalLikes: number;
  totalVideos: number;
  channelId: string;
}

