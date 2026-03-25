using VidiMetrics.DataAccess.Data;
using VidiMetrics.Domain.Models.Seo;

namespace VidiMetrics.DataAccess.Repositories.Seo.KeywordRankings
{
    public class KeywordRankingsRepository : BaseRepository<KeywordRanking>, IKeywordRankingsRepository
    {
        public KeywordRankingsRepository(AppDbContext context) : base(context) { }
    }
}
