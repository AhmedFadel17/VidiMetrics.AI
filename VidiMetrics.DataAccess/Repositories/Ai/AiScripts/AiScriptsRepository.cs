using VidiMetrics.DataAccess.Data;
using VidiMetrics.Domain.Models.Ai;
using VidiMetrics.DataAccess.Providers.Cashing;

namespace VidiMetrics.DataAccess.Repositories.Ai.AiScripts
{
    public class AiScriptsRepository : BaseRepository<AiScript>, IAiScriptsRepository
    {
        public AiScriptsRepository(AppDbContext context, ICacheProvider cacheProvider) : base(context,cacheProvider) { }
    }
}
