using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Domain.Enums;

namespace VidiMetrics.Application.DTOs.Ai.AiImages;

public record AiImageFilterDto : BaseFilterDto
{
    public AssetType? AssetType { get; set; }
}
