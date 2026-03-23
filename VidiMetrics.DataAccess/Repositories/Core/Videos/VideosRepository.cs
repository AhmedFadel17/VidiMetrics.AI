using VidiMetrics.DataAccess.Data;
using VidiMetrics.Domain.Models.Core;

namespace VidiMetrics.DataAccess.Repositories.Core.Videos
{
    public class VideosRepository : BaseRepository<Video>,IVideosRepository
    {
        public VideosRepository(AppDbContext context) : base(context) { }
    }
}
