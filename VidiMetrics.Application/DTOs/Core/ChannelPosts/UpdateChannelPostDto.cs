using System;
using VidiMetrics.Domain.Enums;

namespace VidiMetrics.Application.DTOs.Core.ChannelPosts
{
    public record UpdateChannelPostDto
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? ThumbnailUrl { get; set; }
        public string? VideoUrl { get; set; }
        public DateTime? ScheduledAt { get; set; }
        public PostStatus? Status { get; set; }
    }
}
