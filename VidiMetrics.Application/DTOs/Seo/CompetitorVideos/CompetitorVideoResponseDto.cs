using System;

namespace VidiMetrics.Application.DTOs.Seo.CompetitorVideos
{
    public class CompetitorVideoResponseDto
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? CreatedBy { get; set; }
        public bool IsDeleted { get; set; }
        public string YouTubeVideoId { get; set; }
        public string Title { get; set; }
        public string ChannelName { get; set; }
        public int CurrentRank { get; set; }
        public Guid TargetKeywordId { get; set; }
    }
}
