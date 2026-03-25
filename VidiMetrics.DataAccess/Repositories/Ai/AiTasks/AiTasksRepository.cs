using VidiMetrics.DataAccess.Data;
using VidiMetrics.Domain.Models.Ai;

namespace VidiMetrics.DataAccess.Repositories.Ai.AiTasks
{
    public class AiTasksRepository : BaseRepository<AiTask>, IAiTasksRepository
    {
        public AiTasksRepository(AppDbContext context) : base(context) { }
    }
}
