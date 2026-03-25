using System;

namespace VidiMetrics.Application.DTOs.StoryEngine.Environments
{
    public class EnvironmentResponseDto
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? CreatedBy { get; set; }
        public bool IsDeleted { get; set; }
        public string Name { get; set; }
        public string VisualDescription { get; set; }
        public string Atmosphere { get; set; }
        public string? ReferenceImageUrl { get; set; }
        public Guid SeriesId { get; set; }
    }
}
