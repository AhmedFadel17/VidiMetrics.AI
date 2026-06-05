using VidiMetrics.DataAccess.Data;
using VidiMetrics.Domain.Models.Core;
using VidiMetrics.DataAccess.Providers.Cashing;

namespace VidiMetrics.DataAccess.Repositories.Core.Channels
{
    public class ChannelsRepository : BaseRepository<Channel>, IChannelsRepository
    {
        public ChannelsRepository(AppDbContext context, ICacheProvider cacheProvider) : base(context, cacheProvider) { }
    }
}
