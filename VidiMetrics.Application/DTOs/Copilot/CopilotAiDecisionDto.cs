using VidiMetrics.Domain.Enums.Copilot;

namespace VidiMetrics.Application.DTOs.Copilot;

public record CopilotAiDecisionDto
{
    public CopilotResponseMode Mode { get; set; } = CopilotResponseMode.Chat;
    public CopilotActionType Action { get; set; } = CopilotActionType.Chat;
    public CopilotEntityType Entity { get; set; } = CopilotEntityType.Unknown;

    public Guid? EntityId { get; set; }

    public CopilotEntityType? ParentEntity { get; set; }
    public Guid? ParentEntityId { get; set; }

    public string Answer { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;

    public Dictionary<string, object>? Payload { get; set; }

    public List<string> MissingFields { get; set; } = new();
    public List<string> ValidationWarnings { get; set; } = new();
}