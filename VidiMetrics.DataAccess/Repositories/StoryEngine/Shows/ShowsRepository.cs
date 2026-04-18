using Microsoft.EntityFrameworkCore;
using VidiMetrics.DataAccess.Data;
using VidiMetrics.Domain.Models.StoryEngine;

namespace VidiMetrics.DataAccess.Repositories.StoryEngine.Shows
{
    public class ShowsRepository : BaseRepository<Show>, IShowsRepository
    {
        public ShowsRepository(AppDbContext context) : base(context) { }

        // public async Task<IEnumerable<Show>> GetUserShowsAsync(Guid userId)
        // {
        //     return await _context.Shows
        //         .Where(s => s.UserId == userId)
        //         .ToListAsync();
        // }
    }
}
