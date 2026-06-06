using System;

namespace VidiMetrics.Application.DTOs.Ai.AiScripts
{
    public record ScriptLineResponseDto
    {
        public Guid Id { get; set; }
        public int Sequence { get; set; }
        public int Type { get; set; }
        public Guid? CharacterId { get; set; }
        public string? CharacterStatus { get; set; }
        public string Content { get; set; } = string.Empty;
        public Guid AiScriptId { get; set; }
    }
}
