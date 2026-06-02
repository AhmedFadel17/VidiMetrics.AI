using System;
using System.Collections.Generic;
using VidiMetrics.Application.DTOs.StoryEngine.StoryEnvironments;

namespace VidiMetrics.Application.DTOs.Ai.AiScripts
{
    public class AiScriptResponseDto
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Weather { get; set; } = string.Empty;
        public string EnvironmentDescription { get; set; } = string.Empty;
        public string VisualPrompt { get; set; } = string.Empty;
        public bool IsLinked { get; set; } = false;
        public Guid StoryEnvironmentId { get; set; }
        public StoryEnvironmentResponseDto? StoryEnvironment { get; set; }
        public ICollection<ScriptLineResponseDto> ScriptLines { get; set; } = new List<ScriptLineResponseDto>();
    }
}
