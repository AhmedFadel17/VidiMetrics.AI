using System;
using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Domain.Enums.StoryEngine;

namespace VidiMetrics.Application.DTOs.StoryEngine.Characters
{
    public record CharacterResponseDto : BaseResponseDto
    {
        public string Name { get; set; } = string.Empty;
        public string PhysicalDescription { get; set; } = string.Empty;
        public string ClothingStyle { get; set; } = string.Empty;
        public List<string> PersonalityTraits { get; set; } = new();
        public CharacterImportance Importance { get; set; }
        public string Role { get; set; } = string.Empty;
        public int InsightLevel { get; set; }
        public string? VoiceId { get; set; }
        public string? ReferenceImageUrl { get; set; }
        public Guid ShowId { get; set; }
    }
}
