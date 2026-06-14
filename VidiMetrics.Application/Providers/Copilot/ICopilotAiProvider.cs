using VidiMetrics.Application.DTOs.Copilot;
using VidiMetrics.Domain.Models.Copilot;

namespace VidiMetrics.Application.Providers.Copilot;

public interface ICopilotAiProvider
{
    Task<CopilotAiDecisionDto> GetDecisionAsync(
            List<CopilotMessage> messages,
            CancellationToken ct = default);
}
