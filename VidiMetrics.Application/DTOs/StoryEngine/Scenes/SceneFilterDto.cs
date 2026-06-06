using VidiMetrics.Application.DTOs.Common;

namespace VidiMetrics.Application.DTOs.StoryEngine.Scenes;

public record SceneFilterDto : BaseFilterDto
{
    public Guid? EpisodeId { get; set; }
    public string? Name { get; set; }
    public DateTime? CreatedAfter { get; set; }
    public DateTime? CreatedBefore { get; set; }
}
