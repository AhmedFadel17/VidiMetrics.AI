using System.ComponentModel.DataAnnotations.Schema;
using VidiMetrics.Domain.Models.Ai;

namespace VidiMetrics.Domain.Models.StoryEngine;

public class Location : BaseEntity
{
    public string Name { get; set; } = string.Empty;

    public string VisualDescription { get; set; } = string.Empty;
    public string Atmosphere { get; set; } = string.Empty;

    public Guid? AiImageId { get; set; }
    [ForeignKey("AiImageId")]
    public AiImage? AiImage { get; set; }
    [NotMapped]
    public string? ReferenceImageUrl => AiImage?.ImageUrl;
    public Guid ShowId { get; set; }
    public Show Show { get; set; } = null!;

    public ICollection<Scene> Scenes { get; set; } = new List<Scene>();
}
