using System;

namespace VidiMetrics.Application.DTOs.StoryEngine.StoryEnvironments
{
    public class CreateStoryEnvironmentDto
    {
        public string Name { get; set; }
        public string VisualDescription { get; set; }
        public string Atmosphere { get; set; }
        public string? ReferenceImageUrl { get; set; }
        public Guid SeriesId { get; set; }
    }
}
