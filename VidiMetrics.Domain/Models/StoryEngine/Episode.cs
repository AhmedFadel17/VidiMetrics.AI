using System.ComponentModel.DataAnnotations.Schema;
using VidiMetrics.Domain.Models.Ai;
using VidiMetrics.Domain.Models.Core;
namespace VidiMetrics.Domain.Models.StoryEngine;

public class Episode : BaseEntity
{
    public int EpisodeNumber { get; set; }
    public string Title { get; set; } = string.Empty;
    public string PlotSummary { get; set; } = string.Empty;

    public Guid ShowId { get; set; }
    public Show Show { get; set; } = null!;

    public Guid? AiVideoId { get; set; }
    [ForeignKey("AiVideoId")]
    public AiVideo? AiVideo { get; set; }
    [NotMapped]
    public string? VideoUrl => AiVideo?.VideoUrl;
    [NotMapped]
    public string? ThumbnailUrl => AiVideo?.ThumbnailUrl;
    public ICollection<Scene> Scenes { get; set; } = new List<Scene>();
}
