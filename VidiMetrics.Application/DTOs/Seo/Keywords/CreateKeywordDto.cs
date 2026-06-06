using System;

namespace VidiMetrics.Application.DTOs.Seo.Keywords
{
    public record CreateKeywordDto
    {
        public required string Text { get; set; }
        public required string Language { get; set; }
        public int MonthlySearchVolume { get; set; }
        public double CompetitionScore { get; set; }
        public Guid VideoId { get; set; }
    }
}
