using Microsoft.EntityFrameworkCore;
using VidiMetrics.DataAccess.Data;
using VidiMetrics.DataAccess.Providers.Cashing;
using VidiMetrics.Domain.Models.Copilot;

namespace VidiMetrics.DataAccess.Repositories.Copilot.CopilotMessages;

public class CopilotMessagesRepository : BaseRepository<CopilotMessage>, ICopilotMessagesRepository
{
    public CopilotMessagesRepository(AppDbContext context, ICacheProvider cacheProvider) : base(context, cacheProvider)
    {
    }

    public async Task<List<CopilotMessage>> GetByChatIdAsync(Guid chatId, CancellationToken ct = default)
    {
        return await Query()
            .Where(msg => msg.ChatId == chatId)
            .OrderBy(msg => msg.CreatedAt)
            .ToListAsync(ct);
    }
}
