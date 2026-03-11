namespace VidiMetrics.Domain.Models.Core;

public class Playlist : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? YouTubePlaylistId { get; set; }

    public Guid ChannelId { get; set; }
    public Channel Channel { get; set; } = null!;

    public ICollection<PlaylistItem> PlaylistItems { get; set; } = new List<PlaylistItem>();
}

