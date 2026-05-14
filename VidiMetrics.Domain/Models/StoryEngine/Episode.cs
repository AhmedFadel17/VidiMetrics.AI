using System.ComponentModel.DataAnnotations.Schema;
using VidiMetrics.Domain.Models.Ai;
using VidiMetrics.Domain.Models.Core;
namespace VidiMetrics.Domain.Models.StoryEngine;

public class Episode : BaseEntity
{
    public int EpisodeNumber { get; set; }
    public string Title { get; set; } = string.Empty;
    public string PlotSummary { get; set; } = string.Empty;

    public Guid? ThumbnailImageId { get; set; }
    [ForeignKey("ThumbnailImageId")]
    public AiImage? ThumbnailImage { get; set; }
    [NotMapped]
    public string? ThumbnailUrl => ThumbnailImage?.ImageUrl;

    public Guid ShowId { get; set; }
    public Show Show { get; set; } = null!;

    public Guid? FinalVideoId { get; set; }
    public Video? FinalVideo { get; set; }

    public ICollection<Scene> Scenes { get; set; } = new List<Scene>();
}
