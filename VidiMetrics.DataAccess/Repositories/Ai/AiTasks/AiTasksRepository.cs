using VidiMetrics.DataAccess.Data;
using VidiMetrics.Domain.Models.Ai;
using VidiMetrics.DataAccess.Providers.Cashing;

namespace VidiMetrics.DataAccess.Repositories.Ai.AiTasks
{
    public class AiTasksRepository : BaseRepository<AiTask>, IAiTasksRepository
    {
        public AiTasksRepository(AppDbContext context, ICacheProvider cacheProvider) : base(context,cacheProvider) { }
    }
}
