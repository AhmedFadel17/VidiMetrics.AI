namespace VidiMetrics.Domain.Models.Seo;

public class CompetitorVideo : BaseEntity
{
    public string YouTubeVideoId { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string ChannelName { get; set; } = string.Empty;
    public int CurrentRank { get; set; }

    public Guid TargetKeywordId { get; set; }
    public Keyword TargetKeyword { get; set; } = null!;
}