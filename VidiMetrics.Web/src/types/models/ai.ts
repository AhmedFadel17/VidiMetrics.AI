import { BaseEntity } from "./base";
import { ScriptLineType, AssetType } from "../enums";
import { Location } from "./storyEngine";

// ─── AiImage ──────────────────────────────────────────────────────────────────
export interface AiImage extends BaseEntity {
  imageUrl: string;
  prompt?: string;
  seed: number;
  size: number;
  assetType: AssetType;
  isLinked: boolean;
  userId: string;
}

// ─── AiScript ─────────────────────────────────────────────────────────────────
export interface AiScript extends BaseEntity {
  weather: string;
  environmentDescription: string;
  visualPrompt: string;
  locationId: string;
  location?: Location;
  scriptLines?: ScriptLine[];
  isLinked: boolean;
}

// ─── ScriptLine ───────────────────────────────────────────────────────────────
export interface ScriptLine extends BaseEntity {
  sequence: number;
  type: ScriptLineType;
  characterId?: string;
  characterStatus?: string;
  content: string;
  aiScriptId: string;
}

// ─── AiVideo ──────────────────────────────────────────────────────────────────
export interface AiVideo extends BaseEntity {
  videoUrl: string;
  thumbnailUrl?: string;
  duration?: number;
  seed: number;
  size: number;
  assetType: AssetType;
  isLinked: boolean;
  userId: string;
}

// ─── MediaStats ───────────────────────────────────────────────────────────────
export interface MediaStats {
  totalVideos: number;
  totalScripts: number;
  totalImages: number;
  totalGenerations: number;
  totalUnlinked: number;
}