using VidiMetrics.DataAccess.Data;
using VidiMetrics.Domain.Models.StoryEngine;

namespace VidiMetrics.DataAccess.Repositories.StoryEngine.Environments
{
    public class EnvironmentsRepository : BaseRepository<Environment>, IEnvironmentsRepository
    {
        public EnvironmentsRepository(AppDbContext context) : base(context) { }
    }
}
