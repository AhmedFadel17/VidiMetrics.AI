using System;

namespace VidiMetrics.Application.DTOs.StoryEngine.Characters
{
    public class CharacterResponseDto
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? CreatedBy { get; set; }
        public bool IsDeleted { get; set; }
        public string Name { get; set; }
        public string PhysicalDescription { get; set; }
        public string ClothingStyle { get; set; }
        public string PersonalityTraits { get; set; }
        public string Role { get; set; }
        public int InsightLevel { get; set; }
        public string? VoiceId { get; set; }
        public string? ReferenceImageUrl { get; set; }
        public Guid ShowId { get; set; }
    }
}
