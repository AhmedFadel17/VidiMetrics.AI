using System;

namespace VidiMetrics.Application.DTOs.StoryEngine.Scenes
{
    public class SceneResponseDto
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? CreatedBy { get; set; }
        public bool IsDeleted { get; set; }
        public int Order { get; set; }
        public string Script { get; set; }
        public string VisualPrompt { get; set; }
        public Guid EnvironmentId { get; set; }
        public Guid EpisodeId { get; set; }
    }
}
