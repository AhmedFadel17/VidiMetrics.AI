using System;
using VidiMetrics.Domain.Enums;

namespace VidiMetrics.Application.DTOs.Core.ChannelPosts
{
    public record CreateChannelPostDto
    {
        public required string Title { get; set; }
        public string Description { get; set; } = string.Empty;
        public string ThumbnailUrl { get; set; } = string.Empty;
        public required string VideoUrl { get; set; }
        public DateTime? ScheduledAt { get; set; }
        public PostStatus Status { get; set; } = PostStatus.Draft;
        public required Guid ChannelId { get; set; }
    }
}
