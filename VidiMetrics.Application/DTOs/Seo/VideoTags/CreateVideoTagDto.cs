using System;

namespace VidiMetrics.Application.DTOs.Seo.VideoTags
{
    public class CreateVideoTagDto
    {
        public string Name { get; set; }
        public double RelevanceScore { get; set; }
        public Guid VideoId { get; set; }
    }
}
