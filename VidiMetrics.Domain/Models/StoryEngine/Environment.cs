namespace VidiMetrics.Domain.Models.StoryEngine;

public class Environment : BaseEntity
{
    public string Name { get; set; } = string.Empty;

    public string VisualDescription { get; set; } = string.Empty; 
    public string Atmosphere { get; set; } = string.Empty; 

    public string? ReferenceImageUrl { get; set; }

    public Guid SeriesId { get; set; }
    public Series Series { get; set; } = null!;

    public ICollection<Scene> Scenes { get; set; } = new List<Scene>();
}