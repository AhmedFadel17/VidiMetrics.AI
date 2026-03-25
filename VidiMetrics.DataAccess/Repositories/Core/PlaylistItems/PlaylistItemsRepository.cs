using VidiMetrics.DataAccess.Data;
using VidiMetrics.Domain.Models.Core;

namespace VidiMetrics.DataAccess.Repositories.Core.PlaylistItems
{
    public class PlaylistItemsRepository : BaseRepository<PlaylistItem>, IPlaylistItemsRepository
    {
        public PlaylistItemsRepository(AppDbContext context) : base(context) { }
    }
}
