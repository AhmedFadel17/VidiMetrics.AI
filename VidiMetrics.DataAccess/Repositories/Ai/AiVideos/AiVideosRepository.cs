using VidiMetrics.DataAccess.Data;
using VidiMetrics.Domain.Models.Ai;

namespace VidiMetrics.DataAccess.Repositories.Ai.AiVideos
{
    public class AiVideosRepository : BaseRepository<AiVideo>, IAiVideosRepository
    {
        public AiVideosRepository(AppDbContext context) : base(context) { }
    }
}
