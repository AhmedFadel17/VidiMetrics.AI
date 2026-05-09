using VidiMetrics.Application.DTOs.Common;

namespace VidiMetrics.Application.DTOs.StoryEngine.StoryEnvironments;

public class StoryEnvironmentFilterDto : BaseFilterDto
{
    public Guid? ShowId { get; set; }
    public DateTime? CreatedAfter { get; set; }
    public DateTime? CreatedBefore { get; set; }
}
