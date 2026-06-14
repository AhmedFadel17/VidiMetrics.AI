using VidiMetrics.Domain.Models.Copilot;

namespace VidiMetrics.Application.Interfaces.Copilot;

public interface ICopilotExecutionRouter
{
    Task<object?> ExecuteAsync(Guid userId, CopilotDraft draft, CancellationToken ct = default);
}
