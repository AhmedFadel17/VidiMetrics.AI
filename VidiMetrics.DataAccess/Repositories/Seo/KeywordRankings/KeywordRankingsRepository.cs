using VidiMetrics.DataAccess.Data;
using VidiMetrics.Domain.Models.Seo;
using VidiMetrics.DataAccess.Providers.Cashing;

namespace VidiMetrics.DataAccess.Repositories.Seo.KeywordRankings
{
    public class KeywordRankingsRepository : BaseRepository<KeywordRanking>, IKeywordRankingsRepository
    {
        public KeywordRankingsRepository(AppDbContext context, ICacheProvider cacheProvider) : base(context,cacheProvider) { }
    }
}
