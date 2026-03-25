using System;

namespace VidiMetrics.Application.DTOs.Seo.SeoAudits
{
    public class SeoAuditResponseDto
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? CreatedBy { get; set; }
        public bool IsDeleted { get; set; }
        public int OverallScore { get; set; }
        public string CriticalIssues { get; set; }
        public string OptimizationSuggestions { get; set; }
        public bool HasClosedCaptions { get; set; }
        public bool IsTitleOptimized { get; set; }
        public bool IsDescriptionOptimized { get; set; }
        public Guid VideoId { get; set; }
    }
}
