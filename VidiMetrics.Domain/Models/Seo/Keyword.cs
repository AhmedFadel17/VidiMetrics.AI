namespace VidiMetrics.Domain.Models.Seo;

public class Keyword : BaseEntity
{
    public string Text { get; set; } = string.Empty;
    public string Language { get; set; } = "en";
    public int MonthlySearchVolume { get; set; }
    public double CompetitionScore { get; set; } 

    public ICollection<KeywordRanking> Rankings { get; set; } = new List<KeywordRanking>();
}