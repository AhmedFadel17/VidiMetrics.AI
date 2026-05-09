using VidiMetrics.Application.DTOs.Common;

namespace VidiMetrics.Application.DTOs.StoryEngine.Scenes;

public class SceneFilterDto : BaseFilterDto
{
    public Guid? EpisodeId { get; set; }
    public Guid? StoryEnvironmentId { get; set; }
    public DateTime? CreatedAfter { get; set; }
    public DateTime? CreatedBefore { get; set; }
}
