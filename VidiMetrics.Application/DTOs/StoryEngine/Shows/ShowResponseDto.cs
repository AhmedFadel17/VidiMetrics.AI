using System;

namespace VidiMetrics.Application.DTOs.StoryEngine.Shows
{
    public record ShowResponseDto
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? CreatedBy { get; set; }
        public bool IsDeleted { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string VisualStyle { get; set; } = string.Empty;
        public string TargetAudience { get; set; } = string.Empty;
        public int TotalEpisodes { get; set; }
        public int Status { get; set; }
    }
}
