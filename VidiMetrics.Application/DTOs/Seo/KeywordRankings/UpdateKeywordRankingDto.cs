
namespace VidiMetrics.Application.DTOs.Seo.KeywordRankings
{
    public class UpdateKeywordRankingDto
    {
        public Guid Id { get; set; }
        public int Rank { get; set; }
        public DateTime CapturedAt { get; set; }
        public Guid KeywordId { get; set; }
    }
}
