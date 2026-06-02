using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Domain.Enums;

namespace VidiMetrics.Application.DTOs.Ai.AiVideos
{
    public class AiVideoFilterDto : BaseFilterDto
    {
        public AssetType? AssetType { get; set; }
    }
}
