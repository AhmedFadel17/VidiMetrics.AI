using System;

namespace VidiMetrics.Application.DTOs.StoryEngine.Shows
{
    public record CreateShowDto
    {
        public required string Title { get; set; }
        public required string Description { get; set; }
        public required string VisualStyle { get; set; }
        public required string TargetAudience { get; set; }
        public Guid AiImageId { get; set; }
    }
}
