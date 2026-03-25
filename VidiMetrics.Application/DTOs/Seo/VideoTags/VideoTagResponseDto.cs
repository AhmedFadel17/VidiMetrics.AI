using System;

namespace VidiMetrics.Application.DTOs.Seo.VideoTags
{
    public class VideoTagResponseDto
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? CreatedBy { get; set; }
        public bool IsDeleted { get; set; }
        public string Name { get; set; }
        public double RelevanceScore { get; set; }
        public Guid VideoId { get; set; }
    }
}
