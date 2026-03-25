
namespace VidiMetrics.Application.DTOs.Seo.KeywordRankings
{
    public class KeywordRankingResponseDto
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? CreatedBy { get; set; }
        public bool IsDeleted { get; set; }
        public int Rank { get; set; }
        public DateTime CapturedAt { get; set; }
        public Guid KeywordId { get; set; }
    }
}
