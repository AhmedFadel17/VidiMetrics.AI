using System.ComponentModel.DataAnnotations.Schema;
using VidiMetrics.Domain.Models.Ai;

namespace VidiMetrics.Domain.Models.StoryEngine;

public class Character : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string PhysicalDescription { get; set; } = string.Empty;
    public string ClothingStyle { get; set; } = string.Empty;
    public string PersonalityTraits { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public int InsightLevel { get; set; } = 0;

    public Guid? VoiceProfileId { get; set; }

    [ForeignKey("VoiceProfileId")]
    public VoiceProfile? VoiceProfile { get; set; }

    public Guid? AiImageId { get; set; }
    [ForeignKey("AiImageId")]
    public AiImage? AiImage { get; set; }
    [NotMapped]
    public string? ReferenceImageUrl => AiImage?.ImageUrl;

    public Guid ShowId { get; set; }
    public Show Show { get; set; } = null!;

    public ICollection<SceneCharacter> SceneCharacters { get; set; } = new List<SceneCharacter>();
}