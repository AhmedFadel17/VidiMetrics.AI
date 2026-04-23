using System;
using VidiMetrics.Domain.Enums;

namespace VidiMetrics.Application.DTOs.StoryEngine.Shows
{
    public class UpdateShowDto
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? VisualStyle { get; set; }
        public string? TargetAudience { get; set; }
        public ShowStatus? Status { get; set; }
    }
}
