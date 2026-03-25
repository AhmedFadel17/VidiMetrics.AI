using VidiMetrics.DataAccess.Data;
using VidiMetrics.Domain.Models.Core;

namespace VidiMetrics.DataAccess.Repositories.Core.YouTubeVideos
{
    public class YouTubeVideosRepository : BaseRepository<YouTubeVideo>, IYouTubeVideosRepository
    {
        public YouTubeVideosRepository(AppDbContext context) : base(context) { }
    }
}
