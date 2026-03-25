using System;

namespace VidiMetrics.Application.DTOs.StoryEngine.Series
{
    public class CreateSeriesDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string VisualStyle { get; set; }
        public string TargetAudience { get; set; }
    }
}
