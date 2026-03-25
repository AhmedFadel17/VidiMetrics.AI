using VidiMetrics.DataAccess.Data;
using VidiMetrics.Domain.Models.Core;

namespace VidiMetrics.DataAccess.Repositories.Core.LocalVideos
{
    public class LocalVideosRepository : BaseRepository<LocalVideo>, ILocalVideosRepository
    {
        public LocalVideosRepository(AppDbContext context) : base(context) { }
    }
}
