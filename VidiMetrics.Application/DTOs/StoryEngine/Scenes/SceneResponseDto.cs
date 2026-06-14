using System;
using System.Collections.Generic;
using VidiMetrics.Application.DTOs.Ai.AiScripts;
using VidiMetrics.Application.DTOs.Ai.AiVideos;
using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Application.DTOs.StoryEngine.Characters;

namespace VidiMetrics.Application.DTOs.StoryEngine.Scenes
{
    public record SceneResponseDto : BaseResponseDto
    {
        public int Order { get; set; }
        public Guid EpisodeId { get; set; }
        public string Name { get; set; } = string.Empty;
        public AiScriptResponseDto? AiScript { get; set; }
        public AiVideoResponseDto? AiVideo { get; set; }
        public ICollection<CharacterResponseDto> Characters { get; set; } = new List<CharacterResponseDto>();
    }
}
