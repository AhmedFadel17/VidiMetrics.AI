using System;

namespace VidiMetrics.Application.DTOs.Seo.Keywords
{
    public record UpdateKeywordDto
    {
        public string? Text { get; set; }
        public string? Language { get; set; }
        public int? MonthlySearchVolume { get; set; }
        public double? CompetitionScore { get; set; }
        public Guid? VideoId { get; set; }
    }
}
