using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Domain.Enums.Copilot;

namespace VidiMetrics.Application.DTOs.Copilot;

public record CopilotMessageResponseDto : BaseResponseDto
{
    public Guid ChatId { get; set; }
    public CopilotMessageRole Role { get; set; }
    public string Content { get; set; } = string.Empty;
}
