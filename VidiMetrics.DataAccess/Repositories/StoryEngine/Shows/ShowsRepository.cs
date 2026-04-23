using Microsoft.EntityFrameworkCore;
using VidiMetrics.DataAccess.Data;
using VidiMetrics.Domain.Models.StoryEngine;

namespace VidiMetrics.DataAccess.Repositories.StoryEngine.Shows
{
    public class ShowsRepository : BaseRepository<Show>, IShowsRepository
    {
        public ShowsRepository(AppDbContext context) : base(context) { }

        public async Task<Show?> GetWithDetailsByIdAsync(Guid id)
        {
            return await _context.Shows
                .Include(s => s.Episodes.Take(3).OrderBy(e => e.EpisodeNumber))
                .Include(s => s.Characters.Take(3))
                .Include(s => s.StoryEnvironments.Take(3))
                .FirstOrDefaultAsync(s => s.Id == id);
        }
    }
}
