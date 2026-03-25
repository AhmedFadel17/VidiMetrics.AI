using VidiMetrics.DataAccess.Data;
using VidiMetrics.Domain.Models.StoryEngine;

namespace VidiMetrics.DataAccess.Repositories.StoryEngine.StoryEnvironments
{
    public class StoryEnvironmentsRepository : BaseRepository<StoryEnvironment>, IStoryEnvironmentsRepository
    {
        public StoryEnvironmentsRepository(AppDbContext context) : base(context) { }
    }
}
