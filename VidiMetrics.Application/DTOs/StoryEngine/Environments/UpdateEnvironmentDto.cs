using System;

namespace VidiMetrics.Application.DTOs.StoryEngine.Environments
{
    public class UpdateEnvironmentDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string VisualDescription { get; set; }
        public string Atmosphere { get; set; }
        public string? ReferenceImageUrl { get; set; }
        public Guid SeriesId { get; set; }
    }
}
