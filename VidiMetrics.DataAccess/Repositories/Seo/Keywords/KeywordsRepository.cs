using VidiMetrics.DataAccess.Data;
using VidiMetrics.Domain.Models.Seo;

namespace VidiMetrics.DataAccess.Repositories.Seo.Keywords
{
    public class KeywordsRepository : BaseRepository<Keyword>, IKeywordsRepository
    {
        public KeywordsRepository(AppDbContext context) : base(context) { }
    }
}
