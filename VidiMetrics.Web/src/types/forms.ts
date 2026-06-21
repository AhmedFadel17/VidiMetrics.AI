export type CharacterFormValues = {
    name: string
    role: string
    importance: 'Main' | 'Supporting' | 'Extra'
    personalityTraits: string
    insightLevel: number
    physicalDescription: string
    clothingStyle: string
    voiceProfileId?: string
    aiImageId?: string
    referenceImageUrl?: string
}

export type SeriesFormValues = {
    title: string
    description: string
    visualStyle: string
    targetAudience: string
    aiImageId?: string
    referenceImageUrl?: string
}

export type LocationFormValues = {
    name: string
    visualDescription: string
    atmosphere: string
    aiImageId?: string
    referenceImageUrl?: string
}
