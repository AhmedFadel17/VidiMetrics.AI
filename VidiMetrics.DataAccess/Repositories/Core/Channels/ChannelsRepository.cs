using VidiMetrics.DataAccess.Data;
using VidiMetrics.Domain.Models.Core;

namespace VidiMetrics.DataAccess.Repositories.Core.Channels
{
    public class ChannelsRepository : BaseRepository<Channel>, IChannelsRepository
    {
        public ChannelsRepository(AppDbContext context) : base(context) { }
    }
}
