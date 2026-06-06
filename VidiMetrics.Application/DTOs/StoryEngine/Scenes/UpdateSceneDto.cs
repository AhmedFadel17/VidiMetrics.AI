using System;
using System.Collections.Generic;

namespace VidiMetrics.Application.DTOs.StoryEngine.Scenes
{
    public record UpdateSceneDto
    {
        public int? Order { get; set; }
        public string? Name { get; set; }
        public List<Guid>? CharacterIds { get; set; }

        public Guid? AiScriptId { get; set; }
        public Guid? AiVideoId { get; set; }
    }
}
