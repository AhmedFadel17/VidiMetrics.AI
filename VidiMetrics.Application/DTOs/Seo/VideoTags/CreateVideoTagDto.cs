using System;

namespace VidiMetrics.Application.DTOs.Seo.VideoTags
{
    public record CreateVideoTagDto
    {
        public required string Name { get; set; }
        public double RelevanceScore { get; set; }
        public Guid VideoId { get; set; }
    }
}
