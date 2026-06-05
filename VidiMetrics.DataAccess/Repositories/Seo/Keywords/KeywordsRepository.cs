using VidiMetrics.DataAccess.Data;
using VidiMetrics.Domain.Models.Seo;
using VidiMetrics.DataAccess.Providers.Cashing;

namespace VidiMetrics.DataAccess.Repositories.Seo.Keywords
{
    public class KeywordsRepository : BaseRepository<Keyword>, IKeywordsRepository
    {
        public KeywordsRepository(AppDbContext context, ICacheProvider cacheProvider) : base(context, cacheProvider) { }
    }
}
