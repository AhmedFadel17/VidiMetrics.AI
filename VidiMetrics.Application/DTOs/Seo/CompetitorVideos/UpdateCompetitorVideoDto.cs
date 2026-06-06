using System;

namespace VidiMetrics.Application.DTOs.Seo.CompetitorVideos
{
    public record UpdateCompetitorVideoDto
    {
        public string? YouTubeVideoId { get; set; }
        public string? Title { get; set; }
        public string? ChannelName { get; set; }
        public int? CurrentRank { get; set; }
        public Guid? TargetKeywordId { get; set; }
    }
}
