import { BaseEntity } from "./base";
import { AiTaskStatus, ModelTarget, ScriptLineType, AssetType } from "../enums";
import { StoryEnvironment } from "./storyEngine";

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
  storyEnvironmentId: string;
  storyEnvironment?: StoryEnvironment;
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

// ─── AiPromptTemplate ────────────────────────────────────────────────────────
export interface AiPromptTemplate extends BaseEntity {
  name: string;
  systemPrompt: string;
  userPromptTemplate: string;
  modelTarget: ModelTarget;
  temperature: number;
}

// ─── AiTask ───────────────────────────────────────────────────────────────────
export interface AiTask extends BaseEntity {
  taskType: string;
  status: AiTaskStatus;
  inputData?: string;
  outputData?: string;
  errorMessage?: string;
  videoId: string;
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

// ─── Transcript ───────────────────────────────────────────────────────────────
export interface Transcript extends BaseEntity {
  rawText: string;
  cleanedText: string;
  languageCode: string;
  timestampsJson?: string;
  videoId: string;
}
