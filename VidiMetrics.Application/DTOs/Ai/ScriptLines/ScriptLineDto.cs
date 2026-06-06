using VidiMetrics.Domain.Enums;

namespace VidiMetrics.Application.DTOs.Ai.ScriptLines;

public record ScriptLineDto
{
    public int Sequence { get; set; }
    public ScriptLineType Type { get; set; }

    public Guid? CharacterId { get; set; }
    public string? CharacterStatus { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
}
