using System;

namespace VidiMetrics.Application.DTOs.StoryEngine.StoryEnvironments
{
    public record StoryEnvironmentResponseDto
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? CreatedBy { get; set; }
        public bool IsDeleted { get; set; }
        public string Name { get; set; } = string.Empty;
        public string VisualDescription { get; set; } = string.Empty;
        public string Atmosphere { get; set; } = string.Empty;
        public string? ReferenceImageUrl { get; set; }
        public Guid ShowId { get; set; }
    }
}
