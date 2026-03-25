using System;

namespace VidiMetrics.Application.DTOs.Seo.VideoTags
{
    public class UpdateVideoTagDto
    {
        public string Name { get; set; }
        public double RelevanceScore { get; set; }
        public Guid VideoId { get; set; }
    }
}
