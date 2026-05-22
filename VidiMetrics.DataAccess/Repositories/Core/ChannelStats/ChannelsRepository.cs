using VidiMetrics.DataAccess.Data;
using VidiMetrics.Domain.Models.Core;

namespace VidiMetrics.DataAccess.Repositories.Core.ChannelStats
{
    public class ChannelStatsRepository : BaseRepository<ChannelStat>, IChannelStatsRepository
    {
        public ChannelStatsRepository(AppDbContext context) : base(context) { }
    }
}
