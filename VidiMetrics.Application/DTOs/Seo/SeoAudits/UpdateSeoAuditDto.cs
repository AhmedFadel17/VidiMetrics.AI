using System;

namespace VidiMetrics.Application.DTOs.Seo.SeoAudits
{
    public record UpdateSeoAuditDto
    {
        public int? OverallScore { get; set; }
        public string? CriticalIssues { get; set; }
        public string? OptimizationSuggestions { get; set; }
        public bool? HasClosedCaptions { get; set; }
        public bool? IsTitleOptimized { get; set; }
        public bool? IsDescriptionOptimized { get; set; }
        public Guid? VideoId { get; set; }
    }
}
