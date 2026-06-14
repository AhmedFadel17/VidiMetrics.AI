namespace VidiMetrics.Application.DTOs.Copilot;

public record ReviewCopilotDraftRequestDto
{
    public Guid DraftId { get; set; }
    public bool Accept { get; set; }
}
