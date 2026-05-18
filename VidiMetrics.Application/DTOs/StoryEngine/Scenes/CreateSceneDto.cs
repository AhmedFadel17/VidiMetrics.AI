using System;
using System.Collections.Generic;

namespace VidiMetrics.Application.DTOs.StoryEngine.Scenes
{
    public class CreateSceneDto
    {
        public int Order { get; set; }
        public Guid EpisodeId { get; set; }
        public List<Guid> CharacterIds { get; set; } = new List<Guid>();
        public Guid? AiScriptId { get; set; }
        public Guid? AiVideoId { get; set; }
    }
}
