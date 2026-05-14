using VidiMetrics.Domain.Enums;
using VidiMetrics.Domain.Models.StoryEngine;

namespace VidiMetrics.Domain.Models.Ai;

public class ScriptLine : BaseEntity
{
    public int Sequence { get; set; }
    public ScriptLineType Type { get; set; }

    public Guid? CharacterId { get; set; }
    public Character? Character { get; set; }
    public string? CharacterStatus { get; set; }

    public string Content { get; set; } = string.Empty;

    public Guid AiScriptId { get; set; }
    public AiScript AiScript { get; set; } = null!;
}
