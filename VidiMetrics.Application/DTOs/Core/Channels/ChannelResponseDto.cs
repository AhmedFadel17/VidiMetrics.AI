using System;
using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Application.DTOs.Core.ChannelStats;
using VidiMetrics.Domain.Enums.Core;

namespace VidiMetrics.Application.DTOs.Core.Channels
{
    public record ChannelResponseDto : BaseResponseDto
    {
        public string Name { get; set; } = string.Empty;
        public string AvatarUrl { get; set; } = string.Empty;
        public string? AccessToken { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime? ExpiresAt { get; set; }
        public bool IsActive { get; set; }
        public bool IsConnected { get; set; }
        public bool SyncAnalytics { get; set; }
        public bool AutoPost { get; set; }
        public TargetPlatform? Platform { get; set; }

        public string PlatformChannelId { get; set; } = string.Empty;
        public ChannelStatResponseDto? ChannelStat { get; set; }
    }
}
