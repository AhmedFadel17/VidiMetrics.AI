using VidiMetrics.Domain.Models.Core;
namespace VidiMetrics.Domain.Models.StoryEngine;

public class Episode : BaseEntity
{
    public int EpisodeNumber { get; set; }
    public string Title { get; set; } = string.Empty;
    public string PlotSummary { get; set; } = string.Empty;

    public Guid ShowId { get; set; }
    public Show Show { get; set; } = null!;

    public Guid VideoId { get; set; }
    public Video Video { get; set; } = null!;

    public ICollection<Scene> Scenes { get; set; } = new List<Scene>();
}
