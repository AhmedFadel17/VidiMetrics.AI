namespace VidiMetrics.Domain.Models.StoryEngine;

public class Series : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    public string VisualStyle { get; set; } = string.Empty;
    public string TargetAudience { get; set; } = string.Empty;

    public ICollection<Episode> Episodes { get; set; } = new List<Episode>();
    public ICollection<Character> Characters { get; set; } = new List<Character>();
}