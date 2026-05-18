using System;
using VidiMetrics.Application.DTOs.Ai.ScriptLines;
using VidiMetrics.Domain.Models.Ai;

namespace VidiMetrics.Application.DTOs.Ai.AiScripts
{
    public class CreateAiScriptDto
    {
        public string Weather { get; set; } = string.Empty;
        public string EnvironmentDescription { get; set; } = string.Empty;
        public List<ScriptLineDto> ScriptLines { get; set; } = new List<ScriptLineDto>();
        public List<Guid> CharacterIds { get; set; } = new List<Guid>();
        public Guid StoryEnvironmentId { get; set; }
    }
}
