using System;

namespace VidiMetrics.Application.DTOs.StoryEngine.Locations
{
    public record CreateLocationDto
    {
        public required string Name { get; set; }
        public required string VisualDescription { get; set; }
        public required string Atmosphere { get; set; }

        public Guid AiImageId { get; set; }
        public Guid ShowId { get; set; }
    }
}
