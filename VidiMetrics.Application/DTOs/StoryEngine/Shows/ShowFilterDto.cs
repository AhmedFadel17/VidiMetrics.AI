using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Domain.Enums.StoryEngine;

namespace VidiMetrics.Application.DTOs.StoryEngine.Shows;

public record ShowFilterDto : BaseFilterDto
{
    public ShowStatus? Status { get; set; }
    public DateTime? CreatedAfter { get; set; }
    public DateTime? CreatedBefore { get; set; }
}
