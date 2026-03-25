using System;

namespace VidiMetrics.Application.DTOs.Core.Videos
{
    public class CreateVideoDto
    {
        public string Title { get; set; }
        public string? Description { get; set; }
        public TimeSpan Duration { get; set; }
        public string? ThumbnailUrl { get; set; }
        public int CurrentRank { get; set; }
        public DateTime? LastRankCheck { get; set; }
        public Guid ChannelId { get; set; }
    }
}
