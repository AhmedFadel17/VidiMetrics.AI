using System;
using VidiMetrics.Domain.Enums.Core;

namespace VidiMetrics.Application.DTOs.Core.ChannelPosts
{
    public record CreateChannelPostDto
    {
        public required string Title { get; set; }
        public string Description { get; set; } = string.Empty;
        public string ThumbnailUrl { get; set; } = string.Empty;
        public required string VideoUrl { get; set; }
        public DateTime? ScheduledAt { get; set; }
        public ChannelPostStatus Status { get; set; } = ChannelPostStatus.Draft;
        public required Guid ChannelId { get; set; }
    }
}
