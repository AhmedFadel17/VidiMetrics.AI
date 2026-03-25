using System;

namespace VidiMetrics.Application.DTOs.StoryEngine.Scenes
{
    public class CreateSceneDto
    {
        public int Order { get; set; }
        public string Script { get; set; }
        public string VisualPrompt { get; set; }
        public Guid EnvironmentId { get; set; }
        public Guid EpisodeId { get; set; }
    }
}
