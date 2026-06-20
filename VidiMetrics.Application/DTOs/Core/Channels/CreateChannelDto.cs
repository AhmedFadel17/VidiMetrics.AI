using System;
using VidiMetrics.Domain.Enums.Core;

namespace VidiMetrics.Application.DTOs.Core.Channels
{
    public record CreateChannelDto
    {
        public required string Name { get; set; }
        public required string AvatarUrl { get; set; }
        public string? AccessToken { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime? ExpiresAt { get; set; }
        public bool IsActive { get; set; }
        public bool IsConnected { get; set; }
        public bool SyncAnalytics { get; set; }
        public bool AutoPost { get; set; }
        public required TargetPlatform Platform { get; set; }
        public required string PlatformChannelId { get; set; }


    }
}
