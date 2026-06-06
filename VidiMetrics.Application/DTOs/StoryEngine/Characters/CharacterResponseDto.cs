using System;
using VidiMetrics.Application.DTOs.Common;

namespace VidiMetrics.Application.DTOs.StoryEngine.Characters
{
    public record CharacterResponseDto : BaseResponseDto
    {
        public string Name { get; set; } = string.Empty;
        public string PhysicalDescription { get; set; } = string.Empty;
        public string ClothingStyle { get; set; } = string.Empty;
        public string PersonalityTraits { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public int InsightLevel { get; set; }
        public string? VoiceId { get; set; }
        public string? ReferenceImageUrl { get; set; }
        public Guid ShowId { get; set; }
    }
}
