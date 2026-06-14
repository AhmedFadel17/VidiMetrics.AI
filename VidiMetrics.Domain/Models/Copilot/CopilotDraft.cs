using System.ComponentModel.DataAnnotations.Schema;
using VidiMetrics.Domain.Enums.Copilot;
using VidiMetrics.Domain.Models;

namespace VidiMetrics.Domain.Models.Copilot;

public class CopilotDraft : BaseEntity
{
    public Guid ChatId { get; set; }

    [ForeignKey(nameof(ChatId))]
    public CopilotChat Chat { get; set; } = null!;

    public Guid UserId { get; set; }

    public CopilotActionType ActionType { get; set; }
    public CopilotEntityType EntityType { get; set; }
    public Guid? EntityId { get; set; }
    public Guid? ParentEntityId { get; set; }
    public CopilotEntityType? ParentEntityType { get; set; }
    public string UserPrompt { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;

    public string PayloadJson { get; set; } = "{}";

    public string MissingFieldsJson { get; set; } = "[]";
    public string ValidationWarningsJson { get; set; } = "[]";

    public CopilotDraftStatus Status { get; set; } = CopilotDraftStatus.Pending;

    public string? ExecutionResultJson { get; set; }
    public string? ErrorMessage { get; set; }
}
