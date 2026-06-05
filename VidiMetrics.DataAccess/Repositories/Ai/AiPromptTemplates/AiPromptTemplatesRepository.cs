using VidiMetrics.DataAccess.Data;
using VidiMetrics.Domain.Models.Ai;
using VidiMetrics.DataAccess.Providers.Cashing;

namespace VidiMetrics.DataAccess.Repositories.Ai.AiPromptTemplates
{
    public class AiPromptTemplatesRepository : BaseRepository<AiPromptTemplate>, IAiPromptTemplatesRepository
    {
        public AiPromptTemplatesRepository(AppDbContext context, ICacheProvider cacheProvider) : base(context,cacheProvider) { }
    }
}
