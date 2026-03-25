using System;

namespace VidiMetrics.Application.DTOs.Seo.Keywords
{
    public class KeywordResponseDto
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? CreatedBy { get; set; }
        public bool IsDeleted { get; set; }
        public string Text { get; set; }
        public string Language { get; set; }
        public int MonthlySearchVolume { get; set; }
        public double CompetitionScore { get; set; }
        public Guid VideoId { get; set; }
    }
}
