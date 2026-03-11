namespace VidiMetrics.Domain.Models.Core;

public abstract class Video : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public TimeSpan Duration { get; set; }
    public string? ThumbnailUrl { get; set; }

    // SEO & Ranking Data
    public int CurrentRank { get; set; }
    public DateTime? LastRankCheck { get; set; }

    // Relationships
    public Guid ChannelId { get; set; }
    public Channel Channel { get; set; } = null!;

    public ICollection<PlaylistItem> PlaylistItems { get; set; } = new List<PlaylistItem>();
}