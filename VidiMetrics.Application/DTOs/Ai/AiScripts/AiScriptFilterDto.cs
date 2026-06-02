using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Domain.Enums;

namespace VidiMetrics.Application.DTOs.Ai.AiScripts;

public class AiScriptFilterDto : BaseFilterDto
{
    public bool? IsLinked { get; set; }
}
