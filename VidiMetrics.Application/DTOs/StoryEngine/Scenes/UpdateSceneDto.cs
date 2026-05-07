using System;
using System.Collections.Generic;

namespace VidiMetrics.Application.DTOs.StoryEngine.Scenes
{
    public class UpdateSceneDto
    {
        public int Order { get; set; }
        public string Script { get; set; } = string.Empty;
        public string VisualPrompt { get; set; } = string.Empty;
        public Guid StoryEnvironmentId { get; set; }
        public List<Guid> CharacterIds { get; set; } = new List<Guid>();
    }
}
