using System;

namespace VidiMetrics.Application.DTOs.Seo.SeoAudits
{
    public record CreateSeoAuditDto
    {
        public int OverallScore { get; set; }
        public required string CriticalIssues { get; set; }
        public required string OptimizationSuggestions { get; set; }
        public bool HasClosedCaptions { get; set; }
        public bool IsTitleOptimized { get; set; }
        public bool IsDescriptionOptimized { get; set; }
        public Guid VideoId { get; set; }
    }
}
