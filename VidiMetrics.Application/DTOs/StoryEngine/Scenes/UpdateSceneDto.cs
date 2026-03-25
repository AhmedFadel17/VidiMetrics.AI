using System;

namespace VidiMetrics.Application.DTOs.StoryEngine.Scenes
{
    public class UpdateSceneDto
    {
        public Guid Id { get; set; }
        public int Order { get; set; }
        public string Script { get; set; }
        public string VisualPrompt { get; set; }
        public Guid StoryEnvironmentId { get; set; }
        public Guid EpisodeId { get; set; }
    }
}
