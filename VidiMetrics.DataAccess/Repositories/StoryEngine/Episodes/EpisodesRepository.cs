using VidiMetrics.DataAccess.Data;
using VidiMetrics.Domain.Models.StoryEngine;

namespace VidiMetrics.DataAccess.Repositories.StoryEngine.Episodes
{
    public class EpisodesRepository : BaseRepository<Episode>, IEpisodesRepository
    {
        public EpisodesRepository(AppDbContext context) : base(context) { }
    }
}
