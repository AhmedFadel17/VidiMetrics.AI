using VidiMetrics.Domain.Models.Core;

namespace VidiMetrics.Domain.Models.Seo;

public class VideoTag : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public double RelevanceScore { get; set; } 

    public Guid VideoId { get; set; }
    public Video Video { get; set; } = null!;
}