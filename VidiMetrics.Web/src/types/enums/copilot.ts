export enum CopilotResponseMode {
    Chat = 1,
    Draft = 2,
}

export enum CopilotActionType {
    Unknown = 0,
    Chat = 1,
    Create = 2,
    Update = 3,
    Get = 4,
    Delete = 5,
    Link = 6,
    Unlink = 7,
    Generate = 8,
}

export enum CopilotEntityType {
    Unknown = 0,
    Show = 1,
    Episode = 2,
    Character = 3,
    Location = 4,
    Scene = 5,
    SceneCharacter = 6,
    AiScript = 7,
    ScriptLine = 8,
    AiImage = 9,
    AiVideo = 10,
}

export enum CopilotDraftStatus {
    Pending = 0,
    Accepted = 1,
    Rejected = 2,
    Executed = 3,
    Failed = 4,
}

export enum CopilotMessageRole {
    System = 0,
    User = 1,
    Assistant = 2,
}