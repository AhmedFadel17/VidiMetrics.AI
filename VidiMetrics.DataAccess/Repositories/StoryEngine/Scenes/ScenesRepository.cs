using VidiMetrics.DataAccess.Data;
using VidiMetrics.Domain.Models.StoryEngine;

namespace VidiMetrics.DataAccess.Repositories.StoryEngine.Scenes
{
    public class ScenesRepository : BaseRepository<Scene>, IScenesRepository
    {
        public ScenesRepository(AppDbContext context) : base(context) { }
    }
}
