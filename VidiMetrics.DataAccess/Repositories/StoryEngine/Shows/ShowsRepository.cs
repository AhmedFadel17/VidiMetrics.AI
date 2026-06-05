using Microsoft.EntityFrameworkCore;
using VidiMetrics.DataAccess.Data;
using VidiMetrics.Domain.Models.StoryEngine;
using VidiMetrics.DataAccess.Providers.Cashing;

namespace VidiMetrics.DataAccess.Repositories.StoryEngine.Shows
{
    public class ShowsRepository : BaseRepository<Show>, IShowsRepository
    {
        public ShowsRepository(AppDbContext context, ICacheProvider cacheProvider) : base(context,cacheProvider) { }

        public async Task<Show?> GetWithDetailsByIdAsync(Guid id)
        {
            return await _context.Shows
                .Include(s => s.Episodes)
                .FirstOrDefaultAsync(s => s.Id == id);
        }
    }
}
