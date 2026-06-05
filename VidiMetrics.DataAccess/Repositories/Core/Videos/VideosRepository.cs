using VidiMetrics.DataAccess.Data;
using VidiMetrics.Domain.Models.Core;
using VidiMetrics.DataAccess.Providers.Cashing;

namespace VidiMetrics.DataAccess.Repositories.Core.Videos
{
    public class VideosRepository : BaseRepository<Video>,IVideosRepository
    {
        public VideosRepository(AppDbContext context, ICacheProvider cacheProvider) : base(context,cacheProvider) { }
    }
}
