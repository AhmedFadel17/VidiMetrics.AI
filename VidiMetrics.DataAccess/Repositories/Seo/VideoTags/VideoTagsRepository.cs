using VidiMetrics.DataAccess.Data;
using VidiMetrics.Domain.Models.Seo;

namespace VidiMetrics.DataAccess.Repositories.Seo.VideoTags
{
    public class VideoTagsRepository : BaseRepository<VideoTag>, IVideoTagsRepository
    {
        public VideoTagsRepository(AppDbContext context) : base(context) { }
    }
}
