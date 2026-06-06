using System;
using VidiMetrics.Application.DTOs.Common;

namespace VidiMetrics.Application.DTOs.Seo.CompetitorVideos
{
    public record CompetitorVideoResponseDto : BaseResponseDto
    {
        public string YouTubeVideoId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string ChannelName { get; set; } = string.Empty;
        public int CurrentRank { get; set; }
        public Guid TargetKeywordId { get; set; }
    }
}
