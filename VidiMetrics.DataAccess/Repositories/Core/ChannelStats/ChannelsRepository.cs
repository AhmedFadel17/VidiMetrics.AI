using VidiMetrics.DataAccess.Data;
using VidiMetrics.Domain.Models.Core;
using VidiMetrics.DataAccess.Providers.Cashing;

namespace VidiMetrics.DataAccess.Repositories.Core.ChannelStats
{
    public class ChannelStatsRepository : BaseRepository<ChannelStat>, IChannelStatsRepository
    {
        public ChannelStatsRepository(AppDbContext context, ICacheProvider cacheProvider) : base(context, cacheProvider) { }
    }
}
