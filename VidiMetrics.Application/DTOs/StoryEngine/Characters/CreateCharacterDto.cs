using System;

namespace VidiMetrics.Application.DTOs.StoryEngine.Characters
{
    public record CreateCharacterDto
    {
        public required string Name { get; set; }
        public required string PhysicalDescription { get; set; }
        public required string ClothingStyle { get; set; }
        public required string PersonalityTraits { get; set; }
        public required string Role { get; set; }
        public int InsightLevel { get; set; }
        // public Guid? VoiceProfileId { get; set; }
        public Guid? AiImageId { get; set; }
        public Guid ShowId { get; set; }
    }
}
