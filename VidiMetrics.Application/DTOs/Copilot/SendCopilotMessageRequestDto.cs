namespace VidiMetrics.Application.DTOs.Copilot;

public record SendCopilotMessageRequestDto()
{
    public Guid? ChatId { get; set; }
    public string Message { get; set; } = string.Empty;
}