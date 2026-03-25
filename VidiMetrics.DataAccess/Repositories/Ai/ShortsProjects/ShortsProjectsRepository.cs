using VidiMetrics.DataAccess.Data;
using VidiMetrics.Domain.Models.Ai;

namespace VidiMetrics.DataAccess.Repositories.Ai.ShortsProjects
{
    public class ShortsProjectsRepository : BaseRepository<ShortsProject>, IShortsProjectsRepository
    {
        public ShortsProjectsRepository(AppDbContext context) : base(context) { }
    }
}
