using VidiMetrics.DataAccess.Data;
using VidiMetrics.Domain.Models.StoryEngine;
using VidiMetrics.DataAccess.Providers.Cashing;

namespace VidiMetrics.DataAccess.Repositories.StoryEngine.Scenes
{
    public class ScenesRepository : BaseRepository<Scene>, IScenesRepository
    {
        public ScenesRepository(AppDbContext context, ICacheProvider cacheProvider) : base(context, cacheProvider) { }
    }
}
