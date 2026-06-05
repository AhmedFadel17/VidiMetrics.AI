using VidiMetrics.DataAccess.Data;
using VidiMetrics.Domain.Models.Core;
using VidiMetrics.DataAccess.Providers.Cashing;

namespace VidiMetrics.DataAccess.Repositories.Core.ChannelsPosts
{
    public class ChannelPostsRepository : BaseRepository<ChannelPost>, IChannelPostsRepository
    {
        public ChannelPostsRepository(AppDbContext context, ICacheProvider cacheProvider) : base(context, cacheProvider) { }
    }
}
