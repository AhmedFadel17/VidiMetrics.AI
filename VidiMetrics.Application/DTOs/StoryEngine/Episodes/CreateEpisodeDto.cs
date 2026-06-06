using System;

namespace VidiMetrics.Application.DTOs.StoryEngine.Episodes
{
    public record CreateEpisodeDto
    {
        public int EpisodeNumber { get; set; }
        public required string Title { get; set; }
        public required string PlotSummary { get; set; }
        public Guid ShowId { get; set; }
        public Guid? AiVideoId { get; set; }
    }
}
