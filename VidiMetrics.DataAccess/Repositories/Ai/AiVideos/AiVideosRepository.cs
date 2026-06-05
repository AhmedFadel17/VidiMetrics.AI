using VidiMetrics.DataAccess.Data;
using VidiMetrics.Domain.Models.Ai;
using VidiMetrics.DataAccess.Providers.Cashing;

namespace VidiMetrics.DataAccess.Repositories.Ai.AiVideos
{
    public class AiVideosRepository : BaseRepository<AiVideo>, IAiVideosRepository
    {
        public AiVideosRepository(AppDbContext context, ICacheProvider cacheProvider) : base(context,cacheProvider) { }
    }
}
