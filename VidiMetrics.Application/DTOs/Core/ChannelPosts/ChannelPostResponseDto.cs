using System;
using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Domain.Enums;

namespace VidiMetrics.Application.DTOs.Core.ChannelPosts
{
    public record ChannelPostResponseDto : BaseResponseDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string ThumbnailUrl { get; set; } = string.Empty;
        public string VideoUrl { get; set; } = string.Empty;
        public DateTime? PublishedAt { get; set; }
        public DateTime? ScheduledAt { get; set; }
        public string? ExternalPostId { get; set; }
        public PostStatus? Status { get; set; }

        public string? ErrorMessage { get; set; }
        public Guid ChannelId { get; set; }
    }
}
