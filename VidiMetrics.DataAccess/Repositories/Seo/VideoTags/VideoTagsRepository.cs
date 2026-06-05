using VidiMetrics.DataAccess.Data;
using VidiMetrics.Domain.Models.Seo;
using VidiMetrics.DataAccess.Providers.Cashing;

namespace VidiMetrics.DataAccess.Repositories.Seo.VideoTags
{
    public class VideoTagsRepository : BaseRepository<VideoTag>, IVideoTagsRepository
    {
        public VideoTagsRepository(AppDbContext context, ICacheProvider cacheProvider) : base(context, cacheProvider) { }
    }
}
