using VidiMetrics.Domain.Enums.Copilot;

namespace VidiMetrics.Application.DTOs.Copilot;

public record ReviewCopilotDraftResponseDto
{
    public Guid DraftId { get; set; }
    public CopilotDraftStatus Status { get; set; }
    public string Message { get; set; } = string.Empty;
    public object? Result { get; set; }
}
