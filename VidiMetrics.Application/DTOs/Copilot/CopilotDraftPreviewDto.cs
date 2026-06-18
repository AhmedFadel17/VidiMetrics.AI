using VidiMetrics.Domain.Enums.Copilot;

namespace VidiMetrics.Application.DTOs.Copilot;

public record CopilotDraftPreviewDto
{
    public Guid DraftId { get; set; }
    public CopilotActionType ActionType { get; set; }
    public CopilotEntityType EntityType { get; set; }
    public string Summary { get; set; } = string.Empty;
    public object? Payload { get; set; }
    public List<string> MissingFields { get; set; } = new();
    public List<string> ValidationWarnings { get; set; } = new();
    public bool CanExecute { get; set; }
    public CopilotDraftStatus Status { get; set; }
    public string? ExecutionResultJson { get; set; }
    public string? ErrorMessage { get; set; }
}
