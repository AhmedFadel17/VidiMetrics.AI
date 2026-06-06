
namespace VidiMetrics.Application.DTOs.Seo.KeywordRankings
{
    public record UpdateKeywordRankingDto
    {
        public int? Rank { get; set; }
        public DateTime? CapturedAt { get; set; }
        public Guid? KeywordId { get; set; }
    }
}
