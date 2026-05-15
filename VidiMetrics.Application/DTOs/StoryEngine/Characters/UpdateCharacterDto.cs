using System;

namespace VidiMetrics.Application.DTOs.StoryEngine.Characters
{
    public class UpdateCharacterDto
    {
        public string? Name { get; set; }
        public string? PhysicalDescription { get; set; }
        public string? ClothingStyle { get; set; }
        public string? PersonalityTraits { get; set; }
        public string? Role { get; set; }
        public int? InsightLevel { get; set; }
        public Guid? VoiceProfileId { get; set; }
        public Guid? AiImageId { get; set; }
        public Guid? ShowId { get; set; }
    }
}
