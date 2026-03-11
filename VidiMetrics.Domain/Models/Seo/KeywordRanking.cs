using VidiMetrics.Domain.Models.Core;

namespace VidiMetrics.Domain.Models.Seo;

public class KeywordRanking 
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public int Rank { get; set; }
    public DateTime CapturedAt { get; set; } = DateTime.UtcNow.Date;

    public Guid KeywordId { get; set; }
    public Keyword Keyword { get; set; } = null!;


}