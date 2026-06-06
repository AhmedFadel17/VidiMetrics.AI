using System;

namespace VidiMetrics.Application.DTOs.Seo.CompetitorVideos
{
    public record CreateCompetitorVideoDto
    {
        public required string YouTubeVideoId { get; set; }
        public required string Title { get; set; }
        public required string ChannelName { get; set; }
        public int CurrentRank { get; set; }
        public Guid TargetKeywordId { get; set; }
    }
}
