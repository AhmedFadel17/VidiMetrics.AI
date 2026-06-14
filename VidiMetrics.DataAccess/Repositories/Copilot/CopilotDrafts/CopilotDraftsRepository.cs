using VidiMetrics.DataAccess.Data;
using VidiMetrics.DataAccess.Providers.Cashing;
using VidiMetrics.Domain.Models.Copilot;

namespace VidiMetrics.DataAccess.Repositories.Copilot.CopilotDrafts;

public class CopilotDraftsRepository : BaseRepository<CopilotDraft>, ICopilotDraftsRepository
{
    public CopilotDraftsRepository(AppDbContext context, ICacheProvider cacheProvider) : base(context, cacheProvider)
    {
    }
}
