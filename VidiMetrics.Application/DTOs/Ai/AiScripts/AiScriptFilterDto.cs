using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Domain.Enums;

namespace VidiMetrics.Application.DTOs.Ai.AiScripts;

public record AiScriptFilterDto : BaseFilterDto
{
    public bool? IsLinked { get; set; }
}
