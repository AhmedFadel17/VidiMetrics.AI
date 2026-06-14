using System;
using System.Collections.Generic;
using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Application.DTOs.StoryEngine.Locations;

namespace VidiMetrics.Application.DTOs.Ai.AiScripts
{
    public record AiScriptResponseDto : BaseResponseDto
    {
        public string Weather { get; set; } = string.Empty;
        public string EnvironmentDescription { get; set; } = string.Empty;
        public string VisualPrompt { get; set; } = string.Empty;
        public bool IsLinked { get; set; } = false;
        public Guid LocationId { get; set; }
        public LocationResponseDto? Location { get; set; }
        public ICollection<ScriptLineResponseDto> ScriptLines { get; set; } = new List<ScriptLineResponseDto>();
    }
}
