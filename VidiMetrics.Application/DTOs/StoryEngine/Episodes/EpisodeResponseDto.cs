using System;
using VidiMetrics.Application.DTOs.Common;

namespace VidiMetrics.Application.DTOs.StoryEngine.Episodes
{
    public record EpisodeResponseDto : BaseResponseDto
    {
        public int EpisodeNumber { get; set; }
        public required string Title { get; set; }
        public required string PlotSummary { get; set; }
        public Guid ShowId { get; set; }
        public string? ThumbnailUrl { get; set; }
        public string? VideoUrl { get; set; }
    }
}
