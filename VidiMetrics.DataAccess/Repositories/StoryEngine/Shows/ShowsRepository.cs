using VidiMetrics.DataAccess.Data;
using VidiMetrics.Domain.Models.StoryEngine;

namespace VidiMetrics.DataAccess.Repositories.StoryEngine.Shows
{
    public class ShowsRepository : BaseRepository<Show>, IShowsRepository
    {
        public ShowsRepository(AppDbContext context) : base(context) { }
    }
}
