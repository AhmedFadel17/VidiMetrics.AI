using System;

namespace VidiMetrics.Application.DTOs.StoryEngine.Shows
{
    public class ShowResponseDto
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? CreatedBy { get; set; }
        public bool IsDeleted { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string VisualStyle { get; set; }
        public string TargetAudience { get; set; }
        public int Status { get; set; }
    }
}
