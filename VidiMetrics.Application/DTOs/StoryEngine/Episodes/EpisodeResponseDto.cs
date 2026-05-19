using System;

namespace VidiMetrics.Application.DTOs.StoryEngine.Episodes
{
    public class EpisodeResponseDto
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? CreatedBy { get; set; }
        public bool IsDeleted { get; set; }
        public int EpisodeNumber { get; set; }
        public required string Title { get; set; }
        public required string PlotSummary { get; set; }
        public Guid ShowId { get; set; }
        public string? ThumbnailUrl { get; set; }
        public string? VideoUrl { get; set; }
    }
}
