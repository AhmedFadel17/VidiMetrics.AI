using System;

namespace VidiMetrics.Application.DTOs.StoryEngine.StoryEnvironments
{
    public record UpdateStoryEnvironmentDto
    {
        public string? Name { get; set; }
        public string? VisualDescription { get; set; }
        public string? Atmosphere { get; set; }
        public Guid? AiImageId { get; set; }
        public Guid? ShowId { get; set; }
    }
}
