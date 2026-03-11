using VidiMetrics.Domain.Models.Core;

namespace VidiMetrics.Domain.Models.Seo;

public class KeywordRanking : BaseEntity
{
    public int Rank { get; set; }
    public DateTime CapturedAt { get; set; } = DateTime.UtcNow.Date;
    public string SearchEngine { get; set; } = "YouTube";

    public Guid KeywordId { get; set; }
    public Keyword Keyword { get; set; } = null!;

    public Guid VideoId { get; set; }
    public Video Video { get; set; } = null!;
}