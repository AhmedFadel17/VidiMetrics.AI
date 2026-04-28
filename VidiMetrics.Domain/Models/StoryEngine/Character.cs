namespace VidiMetrics.Domain.Models.StoryEngine;

public class Character : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string PhysicalDescription { get; set; } = string.Empty;
    public string ClothingStyle { get; set; } = string.Empty;
    public string PersonalityTraits { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public int InsightLevel { get; set; } = 0;
    public string? VoiceId { get; set; }

    public string? ReferenceImageUrl { get; set; }

    public Guid ShowId { get; set; }
    public Show Show { get; set; } = null!;

    public ICollection<Scene> Scenes { get; set; } = new List<Scene>();
}