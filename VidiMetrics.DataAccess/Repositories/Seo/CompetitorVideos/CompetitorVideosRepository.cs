using VidiMetrics.DataAccess.Data;
using VidiMetrics.Domain.Models.Seo;
using VidiMetrics.DataAccess.Providers.Cashing;

namespace VidiMetrics.DataAccess.Repositories.Seo.CompetitorVideos
{
    public class CompetitorVideosRepository : BaseRepository<CompetitorVideo>, ICompetitorVideosRepository
    {
        public CompetitorVideosRepository(AppDbContext context, ICacheProvider cacheProvider) : base(context, cacheProvider) { }
    }
}
