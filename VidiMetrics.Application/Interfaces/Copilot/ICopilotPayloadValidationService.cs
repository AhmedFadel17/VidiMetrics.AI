using VidiMetrics.Domain.Models.Copilot;

namespace VidiMetrics.Application.Interfaces.Copilot;

public interface ICopilotPayloadValidationService
{
    Task<List<string>> ValidateAsync(CopilotDraft draft, CancellationToken ct = default);
}
