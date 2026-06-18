using System.ComponentModel.DataAnnotations.Schema;
using VidiMetrics.Domain.Enums;
using VidiMetrics.Domain.Models.Ai;
using VidiMetrics.Domain.Models.Core;
using VidiMetrics.Domain.Models.Infra;

namespace VidiMetrics.Domain.Models.StoryEngine;

public class Show : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string VisualStyle { get; set; } = string.Empty;
    public string TargetAudience { get; set; } = string.Empty;
    public ShowStatus Status { get; set; } = ShowStatus.Draft;

    public Guid? AiImageId { get; set; }
    [ForeignKey("AiImageId")]
    public AiImage? AiImage { get; set; }
    [NotMapped]
    public string? ReferenceImageUrl => AiImage?.ImageUrl;

    public Guid UserId { get; set; }
    [ForeignKey("UserId")]
    public UserProfile UserProfile { get; set; } = null!;

    public ICollection<Episode> Episodes { get; set; } = new List<Episode>();
    public ICollection<Character> Characters { get; set; } = new List<Character>();
    public ICollection<Location> Locations { get; set; } = new List<Location>();
    public virtual ICollection<ShowChannel> ShowChannels { get; set; } = new List<ShowChannel>();
    public int TotalEpisodes => Episodes?.Count ?? 0;
}
