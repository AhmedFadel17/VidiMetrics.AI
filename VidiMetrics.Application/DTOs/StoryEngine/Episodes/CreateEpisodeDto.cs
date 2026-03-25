using System;

namespace VidiMetrics.Application.DTOs.StoryEngine.Episodes
{
    public class CreateEpisodeDto
    {
        public int EpisodeNumber { get; set; }
        public string Title { get; set; }
        public string PlotSummary { get; set; }
        public Guid SeriesId { get; set; }
        public Guid VideoId { get; set; }
    }
}
