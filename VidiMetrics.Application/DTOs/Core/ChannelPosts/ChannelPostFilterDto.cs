using System;
using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Domain.Enums.Core;

namespace VidiMetrics.Application.DTOs.Core.ChannelPosts
{
    public record ChannelPostFilterDto : BaseFilterDto
    {
        public ChannelPostStatus? Status { get; set; }
        public Guid ChannelId { get; set; }
        public ChannelSourceEntityType? SourceEntityType { get; set; }
        public Guid? SourceEntityId { get; set; }
        public Guid? ShowId { get; set; }
    }
}
