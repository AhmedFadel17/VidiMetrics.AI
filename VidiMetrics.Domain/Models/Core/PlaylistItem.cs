namespace VidiMetrics.Domain.Models.Core;

public class PlaylistItem : BaseEntity
{
    public int Position { get; set; } 
    public string? Note { get; set; } 

    public Guid PlaylistId { get; set; }
    public Playlist Playlist { get; set; } = null!;

    public Guid VideoId { get; set; }
    public Video Video { get; set; } = null!;
}