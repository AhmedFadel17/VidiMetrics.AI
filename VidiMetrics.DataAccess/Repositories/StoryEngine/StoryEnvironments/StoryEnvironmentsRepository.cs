using VidiMetrics.DataAccess.Data;
using VidiMetrics.Domain.Models.StoryEngine;
using VidiMetrics.DataAccess.Providers.Cashing;

namespace VidiMetrics.DataAccess.Repositories.StoryEngine.StoryEnvironments
{
    public class StoryEnvironmentsRepository : BaseRepository<StoryEnvironment>, IStoryEnvironmentsRepository
    {
        public StoryEnvironmentsRepository(AppDbContext context, ICacheProvider cacheProvider) : base(context, cacheProvider) { }
    }
}
