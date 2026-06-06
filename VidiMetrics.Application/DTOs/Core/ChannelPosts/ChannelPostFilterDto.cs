using System;
using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Domain.Enums;

namespace VidiMetrics.Application.DTOs.Core.ChannelPosts
{
    public record ChannelPostFilterDto : BaseFilterDto
    {
        public PostStatus Status { get; set; }
        public Guid ChannelId { get; set; }
    }
}
