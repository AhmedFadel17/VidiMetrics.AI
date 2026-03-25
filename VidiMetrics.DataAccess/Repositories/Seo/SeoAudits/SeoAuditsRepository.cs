using VidiMetrics.DataAccess.Data;
using VidiMetrics.Domain.Models.Seo;

namespace VidiMetrics.DataAccess.Repositories.Seo.SeoAudits
{
    public class SeoAuditsRepository : BaseRepository<SeoAudit>, ISeoAuditsRepository
    {
        public SeoAuditsRepository(AppDbContext context) : base(context) { }
    }
}
