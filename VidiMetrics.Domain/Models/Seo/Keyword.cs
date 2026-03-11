using VidiMetrics.Domain.Models.Core;

namespace VidiMetrics.Domain.Models.Seo;

public class Keyword : BaseEntity
{
    public string Text { get; set; } = string.Empty;
    public string Language { get; set; } = "en";
    public int MonthlySearchVolume { get; set; }
    public double CompetitionScore { get; set; }
    public Guid VideoId { get; set; }
    public Video Video { get; set; } = null!;
    public ICollection<KeywordRanking> Rankings { get; set; } = new List<KeywordRanking>();
}