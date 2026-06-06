using System;
using VidiMetrics.Application.DTOs.Common;

namespace VidiMetrics.Application.DTOs.Seo.Keywords
{
    public record KeywordResponseDto : BaseResponseDto
    {
        public string Text { get; set; } = string.Empty;
        public string Language { get; set; } = string.Empty;
        public int MonthlySearchVolume { get; set; }
        public double CompetitionScore { get; set; }
        public Guid VideoId { get; set; }
    }
}
