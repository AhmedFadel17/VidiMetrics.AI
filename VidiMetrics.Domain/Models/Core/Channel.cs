namespace VidiMetrics.Domain.Models.Core;

public class Channel : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? YouTubeChannelId { get; set; } 
    public string? Description { get; set; }
    public string? CustomUrl { get; set; } 

    public ICollection<Video> Videos { get; set; } = new List<Video>();
    public ICollection<Playlist> Playlists { get; set; } = new List<Playlist>();
}