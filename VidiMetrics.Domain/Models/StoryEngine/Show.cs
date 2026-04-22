using System.ComponentModel.DataAnnotations.Schema;
using VidiMetrics.Domain.Enums;
using VidiMetrics.Domain.Models.Infra;

namespace VidiMetrics.Domain.Models.StoryEngine;

public class Show : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string VisualStyle { get; set; } = string.Empty;
    public string TargetAudience { get; set; } = string.Empty;
    public ShowStatus Status { get; set; } = ShowStatus.Draft;
    public string? ExternalReferenceId { get; set; }

    public Guid UserId { get; set; }
    [ForeignKey("UserId")]
    public UserProfile UserProfile { get; set; } = null!;

    public ICollection<Episode> Episodes { get; set; } = new List<Episode>();
    public ICollection<Character> Characters { get; set; } = new List<Character>();

    public int TotalEpisodes => Episodes?.Count ?? 0;
}
