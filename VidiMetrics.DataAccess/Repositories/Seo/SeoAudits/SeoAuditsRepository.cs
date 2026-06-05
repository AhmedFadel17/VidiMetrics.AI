using VidiMetrics.DataAccess.Data;
using VidiMetrics.Domain.Models.Seo;
using VidiMetrics.DataAccess.Providers.Cashing;

namespace VidiMetrics.DataAccess.Repositories.Seo.SeoAudits
{
    public class SeoAuditsRepository : BaseRepository<SeoAudit>, ISeoAuditsRepository
    {
        public SeoAuditsRepository(AppDbContext context, ICacheProvider cacheProvider) : base(context, cacheProvider) { }
    }
}
