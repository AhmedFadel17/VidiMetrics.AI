using System;
using VidiMetrics.Domain.Enums.Core;

namespace VidiMetrics.Application.DTOs.Core.Channels
{
    public record UpdateChannelDto
    {
        public string? Name { get; set; }
        public string? AvatarUrl { get; set; }
        public string? AccessToken { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime? ExpiresAt { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsConnected { get; set; }
        public bool? SyncAnalytics { get; set; }
        public bool? AutoPost { get; set; }
        public TargetPlatform? Platform { get; set; }
        public string? PlatformChannelId { get; set; }
    }
}
