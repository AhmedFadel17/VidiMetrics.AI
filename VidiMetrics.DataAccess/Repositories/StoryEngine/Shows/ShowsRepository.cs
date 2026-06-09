using Microsoft.EntityFrameworkCore;
using VidiMetrics.DataAccess.Data;
using VidiMetrics.DataAccess.Providers.Cashing;
using VidiMetrics.Domain.Models.StoryEngine;

namespace VidiMetrics.DataAccess.Repositories.StoryEngine.Shows
{
    public class ShowsRepository : BaseRepository<Show>, IShowsRepository
    {
        public ShowsRepository(AppDbContext context, ICacheProvider cacheProvider) : base(context, cacheProvider) { }

        public async Task<Show?> GetWithDetailsByIdAsync(Guid id)
        {
            return await _context.Shows
                .Include(s => s.Episodes)
                .Include(s => s.AiImage)
                .FirstOrDefaultAsync(s => s.Id == id);
        }
    }
}
