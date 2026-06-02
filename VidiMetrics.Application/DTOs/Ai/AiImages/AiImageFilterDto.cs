using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Domain.Enums;

namespace VidiMetrics.Application.DTOs.Ai.AiImages;

public class AiImageFilterDto : BaseFilterDto
{
    public AssetType? AssetType { get; set; }
}
