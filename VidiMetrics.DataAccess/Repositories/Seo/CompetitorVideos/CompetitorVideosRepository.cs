using VidiMetrics.DataAccess.Data;
using VidiMetrics.Domain.Models.Seo;

namespace VidiMetrics.DataAccess.Repositories.Seo.CompetitorVideos
{
    public class CompetitorVideosRepository : BaseRepository<CompetitorVideo>, ICompetitorVideosRepository
    {
        public CompetitorVideosRepository(AppDbContext context) : base(context) { }
    }
}
