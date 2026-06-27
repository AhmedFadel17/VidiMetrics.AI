using System.ComponentModel.DataAnnotations.Schema;
using VidiMetrics.Domain.Enums.StoryEngine;
using VidiMetrics.Domain.Models.Ai;

namespace VidiMetrics.Domain.Models.StoryEngine;

public class Character : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string PhysicalDescription { get; set; } = string.Empty;
    public string ClothingStyle { get; set; } = string.Empty;
    public string PersonalityTraits { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public CharacterImportance Importance { get; set; } = CharacterImportance.Minor;
    public int InsightLevel { get; set; } = 0;

    public Guid? VoiceProfileId { get; set; }

    [ForeignKey("VoiceProfileId")]
    public VoiceProfile? VoiceProfile { get; set; }

    public Guid? AiImageId { get; set; }
    [ForeignKey("AiImageId")]
    public AiImage? AiImage { get; set; }
    [NotMapped]
    public string? ReferenceImageUrl => AiImage?.ImageUrl;
    [NotMapped]
    public List<string> TraitsList
    {
        get => string.IsNullOrWhiteSpace(PersonalityTraits)
            ? new List<string>()
            : PersonalityTraits.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries)
                               .Select(t => t.Trim())
                               .ToList();
        set => PersonalityTraits = value != null && value.Any()
            ? string.Join(",", value.Select(t => t.Trim()))
            : string.Empty;
    }
    public Guid ShowId { get; set; }
    public Show Show { get; set; } = null!;

    public ICollection<SceneCharacter> SceneCharacters { get; set; } = new List<SceneCharacter>();
}