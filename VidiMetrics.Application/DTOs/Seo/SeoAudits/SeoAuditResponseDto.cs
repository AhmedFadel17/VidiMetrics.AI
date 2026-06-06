using System;
using VidiMetrics.Application.DTOs.Common;

namespace VidiMetrics.Application.DTOs.Seo.SeoAudits
{
    public record SeoAuditResponseDto : BaseResponseDto
    {
        public int OverallScore { get; set; }
        public string CriticalIssues { get; set; } = string.Empty;
        public string OptimizationSuggestions { get; set; } = string.Empty;
        public bool HasClosedCaptions { get; set; }
        public bool IsTitleOptimized { get; set; }
        public bool IsDescriptionOptimized { get; set; }
        public Guid VideoId { get; set; }
    }
}
