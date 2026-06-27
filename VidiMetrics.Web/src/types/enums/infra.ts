export enum UserRole {
  User = 0,
  Admin = 1,
}

export enum CreditActionType {
  GenerateImage = 1,
  GenerateVideo = 2,
  RenderScene = 3,
  UpscaleAsset = 4,
  AiVoiceover = 5
}

export enum NotificationType {
  Info = 1,
  Success = 2,
  Warning = 3,
  Critical = 4
}

export enum SubscriptionStatus {
  Active = 1,
  Expired = 2,
  Cancelled = 3,
}