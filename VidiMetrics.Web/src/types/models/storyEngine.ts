import { BaseEntity } from "./base";
import { ShowStatus } from "../enums";

// ─── Show ─────────────────────────────────────────────────────────────────────
export interface Show extends BaseEntity {
  title: string;
  description: string;
  visualStyle: string;
  targetAudience: string;
  status: ShowStatus;
  externalReferenceId?: string;
  userId: string;
  episodes?: Episode[];
  characters?: Character[];
  storyEnvironments?: StoryEnvironment[];
  totalEpisodes: number;
}

// ─── Character ────────────────────────────────────────────────────────────────
export interface Character extends BaseEntity {
  name: string;
  physicalDescription: string;
  clothingStyle: string;
  personalityTraits: string;
  voiceId?: string;
  referenceImageUrl?: string;
  showId: string;
  scenes?: Scene[];
}

// ─── Episode ──────────────────────────────────────────────────────────────────
export interface Episode extends BaseEntity {
  episodeNumber: number;
  title: string;
  plotSummary: string;
  showId: string;
  videoId: string;
  scenes?: Scene[];
}

// ─── Scene ────────────────────────────────────────────────────────────────────
export interface Scene extends BaseEntity {
  order: number;
  script: string;
  visualPrompt: string;
  storyEnvironmentId: string;
  episodeId: string;
  characters?: Character[];
}

// ─── StoryEnvironment ─────────────────────────────────────────────────────────
export interface StoryEnvironment extends BaseEntity {
  name: string;
  visualDescription: string;
  atmosphere: string;
  referenceImageUrl?: string;
  showId: string;
  scenes?: Scene[];
}
