using VidiMetrics.Domain.Models.Copilot;

namespace VidiMetrics.DataAccess.Repositories.Copilot.CopilotMessages;

public interface ICopilotMessagesRepository : IBaseRepository<CopilotMessage>
{
    Task<List<CopilotMessage>> GetByChatIdAsync(Guid chatId, CancellationToken ct = default);
}
