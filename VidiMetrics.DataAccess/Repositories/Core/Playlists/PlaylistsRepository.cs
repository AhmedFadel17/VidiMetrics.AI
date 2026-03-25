using VidiMetrics.DataAccess.Data;
using VidiMetrics.Domain.Models.Core;

namespace VidiMetrics.DataAccess.Repositories.Core.Playlists
{
    public class PlaylistsRepository : BaseRepository<Playlist>, IPlaylistsRepository
    {
        public PlaylistsRepository(AppDbContext context) : base(context) { }
    }
}
