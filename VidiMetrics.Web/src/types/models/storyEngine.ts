import { BaseEntity } from "./base";
import { CharacterImportance, ShowStatus } from "../enums";
import { AiScript, AiVideo } from "./ai";

// ─── Show ─────────────────────────────────────────────────────────────────────
export interface Show extends BaseEntity {
  title: string;
  description: string;
  visualStyle: string;
  targetAudience: string;
  status: ShowStatus;
  externalReferenceId?: string;
  referenceImageUrl?: string;
  userId: string;
  episodes?: Episode[];
  characters?: Character[];
  locations?: Location[];
  totalEpisodes: number;
}

// ─── Character ────────────────────────────────────────────────────────────────
export interface Character extends BaseEntity {
  name: string;
  physicalDescription: string;
  clothingStyle: string;
  personalityTraits: string[];
  importance: CharacterImportance;
  role: string;
  insightLevel: number;
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
  thumbnailUrl: string;
  showId: string;
  videoId: string;
  scenes?: Scene[];
}

// ─── Scene ────────────────────────────────────────────────────────────────────
export interface Scene extends BaseEntity {
  order: number;
  episodeId: string;
  aiScriptId?: string;
  aiScript?: AiScript;
  aiVideoId?: string;
  aiVideo?: AiVideo;
  characters?: Character[];
  visualPrompt?: string;
  script?: string;
}

// ─── Location ─────────────────────────────────────────────────────────
export interface Location extends BaseEntity {
  name: string;
  visualDescription: string;
  atmosphere: string;
  referenceImageUrl?: string;
  showId: string;
  scenes?: Scene[];
}

export interface ShowDraft {
  Title: string;
  Description: string;
  VisualStyle: string;
  TargetAudience: string;
  Characters?: CharacterDraft[];
  Episodes?: EpisodeDraft[];
  Locations?: LocationDraft[];
}

export interface CharacterDraft {
  Name: string;
  Role: string;
  PhysicalDescription?: string;
  ClothingStyle?: string;
  PersonalityTraits?: string;
  InsightLevel?: number;
}

export interface EpisodeDraft {
  EpisodeNumber: number;
  Title: string;
  PlotSummary: string;
}

export interface LocationDraft {
  Name: string;
  VisualDescription: string;
  Atmosphere: string;
}


export interface StoryEngineStats {
  totalShows: number;
  totalEpisodes: number;
  totalScenes: number;
  totalCharacters: number;
  totalLocations: number;
}