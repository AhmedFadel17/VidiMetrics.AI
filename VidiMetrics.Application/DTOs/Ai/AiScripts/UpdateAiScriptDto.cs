using System;
using System.Collections.Generic;

namespace VidiMetrics.Application.DTOs.Ai.AiScripts
{
    public record UpdateAiScriptDto
    {
        public string? Weather { get; set; } = string.Empty;
        public string? EnvironmentDescription { get; set; } = string.Empty;
        public string? VisualPrompt { get; set; } = string.Empty;
        public Guid? LocationId { get; set; }
        public bool? IsLinked { get; set; }
    }
}
