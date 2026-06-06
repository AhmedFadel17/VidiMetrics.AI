using System;

namespace VidiMetrics.Application.DTOs.StoryEngine.Episodes
{
    public record UpdateEpisodeDto
    {
        public string? Title { get; set; }
        public string? PlotSummary { get; set; }
        public Guid? ShowId { get; set; }
        public Guid? AiVideoId { get; set; }
    }
}
