using System;

namespace VidiMetrics.Application.DTOs.Core.Videos
{
    public record VideoResponseDto
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? CreatedBy { get; set; }
        public bool IsDeleted { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public TimeSpan Duration { get; set; }
        public string? ThumbnailUrl { get; set; }
        public int CurrentRank { get; set; }
        public DateTime? LastRankCheck { get; set; }
        public Guid ChannelId { get; set; }
    }
}
