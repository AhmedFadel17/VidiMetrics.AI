using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Domain.Enums.Ai;

namespace VidiMetrics.Application.DTOs.Ai.AiVideos
{
    public record AiVideoFilterDto : BaseFilterDto
    {
        public AssetType? AssetType { get; set; }
    }
}
