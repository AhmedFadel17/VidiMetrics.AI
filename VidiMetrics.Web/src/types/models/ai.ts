import { BaseEntity } from "./base";
import { AiTaskStatus, ModelTarget, TargetPlatform } from "../enums";

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

// ─── ShortsProject ────────────────────────────────────────────────────────────
export interface ShortsProject extends BaseEntity {
  projectName: string;
  targetPlatform: TargetPlatform;
  expectedClipCount: number;
  originalVideoId: string;
}

// ─── Transcript ───────────────────────────────────────────────────────────────
export interface Transcript extends BaseEntity {
  rawText: string;
  cleanedText: string;
  languageCode: string;
  timestampsJson?: string;
  videoId: string;
}
