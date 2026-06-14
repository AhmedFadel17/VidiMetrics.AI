using VidiMetrics.Domain.Enums.Copilot;

namespace VidiMetrics.Application.DTOs.Copilot;

public record SendCopilotMessageResponseDto
{
    public Guid ChatId { get; set; }
    public Guid MessageId { get; set; }

    public CopilotResponseMode Type { get; set; } = CopilotResponseMode.Chat;
    public string Message { get; set; } = string.Empty;

    public CopilotDraftPreviewDto? Draft { get; set; }
}