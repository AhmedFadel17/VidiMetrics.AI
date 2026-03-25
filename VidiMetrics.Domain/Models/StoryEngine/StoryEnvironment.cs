namespace VidiMetrics.Domain.Models.StoryEngine;

public class StoryEnvironment : BaseEntity
{
    public string Name { get; set; } = string.Empty;

    public string VisualDescription { get; set; } = string.Empty; 
    public string Atmosphere { get; set; } = string.Empty; 

    public string? ReferenceImageUrl { get; set; }

    public Guid ShowId { get; set; }
    public Show Show { get; set; } = null!;

    public ICollection<Scene> Scenes { get; set; } = new List<Scene>();
}
