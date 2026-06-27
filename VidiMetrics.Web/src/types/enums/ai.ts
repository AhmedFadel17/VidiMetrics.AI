export enum ScriptLineType {
  Character = 0,
  ActionDescription = 1,
}


export enum AssetType {
  Unlinked = 0,
  Show = 1,
  Character = 2,
  Location = 3,
  Episode = 4,
  Scene = 5
}


export enum VoiceProvider {
  ElevenLabs = 1,
  OpenAI = 2,
  PlayHT = 3,
  Azure = 4,
  GoogleCloud = 5,
  AmazonPolly = 6,
  Custom = 0
}