namespace VidiMetrics.Domain.Models.Core;

public class YouTubeVideo : Video
{
    public string YouTubeVideoId { get; set; } = string.Empty; 
    public long ViewCount { get; set; }
    public long LikeCount { get; set; }
    public DateTime PublishedAt { get; set; }
    public string? PrivacyStatus { get; set; }
}