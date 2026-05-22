using VidiMetrics.DataAccess.Data;
using VidiMetrics.Domain.Models.Core;

namespace VidiMetrics.DataAccess.Repositories.Core.ChannelsPosts
{
    public class ChannelPostsRepository : BaseRepository<ChannelPost>, IChannelPostsRepository
    {
        public ChannelPostsRepository(AppDbContext context) : base(context) { }
    }
}
