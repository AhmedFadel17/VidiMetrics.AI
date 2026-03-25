using VidiMetrics.DataAccess.Data;
using VidiMetrics.Domain.Models.Ai;

namespace VidiMetrics.DataAccess.Repositories.Ai.AiPromptTemplates
{
    public class AiPromptTemplatesRepository : BaseRepository<AiPromptTemplate>, IAiPromptTemplatesRepository
    {
        public AiPromptTemplatesRepository(AppDbContext context) : base(context) { }
    }
}
