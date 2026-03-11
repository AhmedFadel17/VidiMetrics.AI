using VidiMetrics.Domain.Models.Core;

namespace VidiMetrics.Domain.Models.Seo;

public class SeoAudit : BaseEntity
{
    public int OverallScore { get; set; } 
    public string CriticalIssues { get; set; } = string.Empty; 
    public string OptimizationSuggestions { get; set; } = string.Empty;

    public bool HasClosedCaptions { get; set; }
    public bool IsTitleOptimized { get; set; }
    public bool IsDescriptionOptimized { get; set; }

    public Guid VideoId { get; set; }
    public Video Video { get; set; } = null!;
}