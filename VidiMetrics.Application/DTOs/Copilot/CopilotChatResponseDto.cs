using VidiMetrics.Application.DTOs.Common;

namespace VidiMetrics.Application.DTOs.Copilot;

public record CopilotChatResponseDto : BaseResponseDto
{
    public Guid UserId { get; set; }
    public string Title { get; set; } = string.Empty;
}
