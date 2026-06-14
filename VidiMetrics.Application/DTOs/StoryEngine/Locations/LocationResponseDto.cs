using System;
using VidiMetrics.Application.DTOs.Common;

namespace VidiMetrics.Application.DTOs.StoryEngine.Locations
{
    public record LocationResponseDto : BaseResponseDto
    {
        public string Name { get; set; } = string.Empty;
        public string VisualDescription { get; set; } = string.Empty;
        public string Atmosphere { get; set; } = string.Empty;
        public string? ReferenceImageUrl { get; set; }
        public Guid ShowId { get; set; }
    }
}
