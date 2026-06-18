using System;
using VidiMetrics.Domain.Enums.Core;

namespace VidiMetrics.Application.DTOs.Core.ChannelPosts
{
    public record UpdateChannelPostDto
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? ThumbnailUrl { get; set; }
        public string? VideoUrl { get; set; }
        public DateTime? ScheduledAt { get; set; }
        public ChannelPostStatus? Status { get; set; }
    }
}
