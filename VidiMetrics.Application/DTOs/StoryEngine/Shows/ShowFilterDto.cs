using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Domain.Enums;

namespace VidiMetrics.Application.DTOs.StoryEngine.Shows;

public class ShowFilterDto : BaseFilterDto
{
    public ShowStatus? Status { get; set; }
    public DateTime? CreatedAfter { get; set; }
    public DateTime? CreatedBefore { get; set; }
}
