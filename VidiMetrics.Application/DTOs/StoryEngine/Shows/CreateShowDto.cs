using System;

namespace VidiMetrics.Application.DTOs.StoryEngine.Shows
{
    public class CreateShowDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string VisualStyle { get; set; }
        public string TargetAudience { get; set; }
        public Guid AiImageId { get; set; }
    }
}
