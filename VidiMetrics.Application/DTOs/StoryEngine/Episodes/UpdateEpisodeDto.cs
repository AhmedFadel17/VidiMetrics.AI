using System;

namespace VidiMetrics.Application.DTOs.StoryEngine.Episodes
{
    public class UpdateEpisodeDto
    {
        public int? EpisodeNumber { get; set; }
        public string? Title { get; set; }
        public string? PlotSummary { get; set; }
        public Guid? AiImageId { get; set; }
        public Guid? ShowId { get; set; }
        public Guid? AiVideoId { get; set; }
    }
}
