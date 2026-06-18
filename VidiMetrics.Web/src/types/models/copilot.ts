import {
    CopilotActionType,
    CopilotDraftStatus,
    CopilotEntityType,
    CopilotMessageRole,
    CopilotResponseMode,
} from '@/types/enums/copilot';
import { BaseEntity } from './base';


export interface CreateCopilotChatRequestDto {
    title: string;
}

export interface SendCopilotMessageRequestDto {
    chatId?: string | null;
    message: string;
}

export interface ReviewCopilotDraftRequestDto {
    draftId: string;
    accept: boolean;
}

export interface CopilotDraftPreviewDto {
    draftId: string;
    actionType: CopilotActionType;
    entityType: CopilotEntityType;
    summary: string;
    payload: Record<string, unknown> | null;
    missingFields: string[];
    validationWarnings: string[];
    canExecute: boolean;
    status: CopilotDraftStatus;
    executionResultJson?: string | null;
    errorMessage?: string | null;
}

export interface SendCopilotMessageResponseDto {
    chatId: string;
    messageId: string;
    type: CopilotResponseMode;
    message: string;
    draft?: CopilotDraftPreviewDto | null;
}

export interface ReviewCopilotDraftResponseDto {
    draftId: string;
    status: CopilotDraftStatus;
    message: string;
    result?: unknown;
}

export interface CopilotChatDto extends BaseEntity {
    userId: string;
    title: string;
}

export interface CopilotMessageDto extends BaseEntity {
    id: string;
    chatId: string;
    role: CopilotMessageRole;
    content: string;
    draftId?: string | null;
    draft?: CopilotDraftPreviewDto | null;
}

export interface CopilotDraftDto extends BaseEntity {
    chatId: string;
    userId: string;
    actionType: CopilotActionType;
    entityType: CopilotEntityType;
    userPrompt: string;
    summary: string;
    payloadJson: string;
    missingFieldsJson: string;
    validationWarningsJson: string;
    status: CopilotDraftStatus;
    executionResultJson?: string | null;
    errorMessage?: string | null;
}