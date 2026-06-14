using VidiMetrics.DataAccess.Data;
using VidiMetrics.DataAccess.Providers.Cashing;
using VidiMetrics.Domain.Models.Copilot;

namespace VidiMetrics.DataAccess.Repositories.Copilot.CopilotChats;

public class CopilotChatsRepository : BaseRepository<CopilotChat>, ICopilotChatsRepository
{
    public CopilotChatsRepository(AppDbContext context, ICacheProvider cacheProvider) : base(context, cacheProvider)
    {
    }
}
