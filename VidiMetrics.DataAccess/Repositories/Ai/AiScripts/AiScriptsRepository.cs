using VidiMetrics.DataAccess.Data;
using VidiMetrics.Domain.Models.Ai;

namespace VidiMetrics.DataAccess.Repositories.Ai.AiScripts
{
    public class AiScriptsRepository : BaseRepository<AiScript>, IAiScriptsRepository
    {
        public AiScriptsRepository(AppDbContext context) : base(context) { }
    }
}
