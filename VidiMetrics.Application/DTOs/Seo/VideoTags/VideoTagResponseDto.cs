using System;
using VidiMetrics.Application.DTOs.Common;

namespace VidiMetrics.Application.DTOs.Seo.VideoTags
{
    public record VideoTagResponseDto : BaseResponseDto
    {
        public string Name { get; set; } = string.Empty;
        public double RelevanceScore { get; set; }
        public Guid VideoId { get; set; }
    }
}
