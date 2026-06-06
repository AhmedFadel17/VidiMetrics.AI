
using VidiMetrics.Application.DTOs.Common;

namespace VidiMetrics.Application.DTOs.Seo.KeywordRankings
{
    public record KeywordRankingResponseDto : BaseResponseDto
    {
        public int Rank { get; set; }
        public DateTime CapturedAt { get; set; }
        public Guid KeywordId { get; set; }
    }
}
