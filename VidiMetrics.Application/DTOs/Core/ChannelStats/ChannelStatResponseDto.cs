using System;
using VidiMetrics.Domain.Enums;

namespace VidiMetrics.Application.DTOs.Core.ChannelStats
{
    public class ChannelStatResponseDto
    {
        public int TotalViews { get; set; }
        public int TotalVideos { get; set; }
        public int TotalFollowers { get; set; }
        public int TotalLikes { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
