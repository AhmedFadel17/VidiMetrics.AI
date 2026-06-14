using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Domain.Enums.Copilot;

namespace VidiMetrics.Application.DTOs.Copilot;

public record CopilotDraftResponseDto : BaseResponseDto
{
    public Guid ChatId { get; set; }
    public Guid UserId { get; set; }
    public CopilotResponseMode Mode { get; set; }
    public CopilotActionType ActionType { get; set; }
    public CopilotEntityType EntityType { get; set; }
    public Guid? EntityId { get; set; }
    public CopilotEntityType? ParentEntityType { get; set; }
    public Guid? ParentEntityId { get; set; }
    public string UserPrompt { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;
    public string PayloadJson { get; set; } = "{}";
    public string MissingFieldsJson { get; set; } = "[]";
    public string ValidationWarningsJson { get; set; } = "[]";
    public CopilotDraftStatus Status { get; set; }
    public string? ExecutionResultJson { get; set; }
    public string? ErrorMessage { get; set; }
}
