using System;

namespace VidiMetrics.Application.DTOs.Ai.AiScripts
{
    public class ScriptLineResponseDto
    {
        public Guid Id { get; set; }
        public int Sequence { get; set; }
        public int Type { get; set; } // Depending on enum serialization
        public Guid? CharacterId { get; set; }
        public string? CharacterStatus { get; set; }
        public string Content { get; set; } = string.Empty;
        public Guid AiScriptId { get; set; }
    }
}
