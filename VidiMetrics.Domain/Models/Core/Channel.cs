using System.ComponentModel.DataAnnotations.Schema;
using VidiMetrics.Domain.Enums;
using VidiMetrics.Domain.Models.Infra;

namespace VidiMetrics.Domain.Models.Core;

public class Channel : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string AvatarUrl { get; set; } = string.Empty;
    public string? AccessToken { get; set; }
    public string? RefreshToken { get; set; }
    public DateTime? ExpiresAt { get; set; }
    public bool IsActive { get; set; } = true;
    public bool IsConnected { get; set; } = true;
    public bool SyncAnalytics { get; set; } = true;
    public bool AutoPost { get; set; } = false;
    public Guid UserId { get; set; }
    [ForeignKey("UserId")]
    public UserProfile UserProfile { get; set; } = null!;

    public TargetPlatform Platform { get; set; }
    public string PlatformChannelId { get; set; } = string.Empty;

    // Relationships
    public ICollection<ChannelPost> ChannelPosts { get; set; } = new List<ChannelPost>();
    public virtual ICollection<ShowChannel> ShowChannels { get; set; } = new List<ShowChannel>();
    public virtual ChannelStat ChannelStat { get; set; } = null!;
}