import { BaseEntity } from "./base";

// ─── Keyword ──────────────────────────────────────────────────────────────────
export interface Keyword extends BaseEntity {
  text: string;
  language: string;
  monthlySearchVolume: number;
  competitionScore: number;
  videoId: string;
  rankings?: KeywordRanking[];
}

// ─── KeywordRanking ───────────────────────────────────────────────────────────
export interface KeywordRanking {
  id: string;
  rank: number;
  capturedAt: string;
  keywordId: string;
}

// ─── CompetitorVideo ──────────────────────────────────────────────────────────
export interface CompetitorVideo extends BaseEntity {
  youTubeVideoId: string;
  title: string;
  channelName: string;
  currentRank: number;
  targetKeywordId: string;
}

// ─── SeoAudit ─────────────────────────────────────────────────────────────────
export interface SeoAudit extends BaseEntity {
  overallScore: number;
  criticalIssues: string;
  optimizationSuggestions: string;
  hasClosedCaptions: boolean;
  isTitleOptimized: boolean;
  isDescriptionOptimized: boolean;
  videoId: string;
}

// ─── VideoTag ─────────────────────────────────────────────────────────────────
export interface VideoTag extends BaseEntity {
  name: string;
  relevanceScore: number;
  videoId: string;
}
