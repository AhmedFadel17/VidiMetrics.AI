using System;
using System.Collections.Generic;
using VidiMetrics.Application.DTOs.StoryEngine.Characters;
using VidiMetrics.Application.DTOs.StoryEngine.StoryEnvironments;

namespace VidiMetrics.Application.DTOs.StoryEngine.Scenes
{
    public class SceneResponseDto
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public Guid? CreatedBy { get; set; }
        public bool IsDeleted { get; set; }
        public int Order { get; set; }
        public Guid EpisodeId { get; set; }
        public VidiMetrics.Application.DTOs.Ai.AiScripts.AiScriptResponseDto? AiScript { get; set; }
        public ICollection<CharacterResponseDto> Characters { get; set; } = new List<CharacterResponseDto>();
    }
}
