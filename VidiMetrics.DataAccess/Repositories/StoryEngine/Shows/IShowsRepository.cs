using VidiMetrics.Domain.Models.StoryEngine;

namespace VidiMetrics.DataAccess.Repositories.StoryEngine.Shows
{
    public interface IShowsRepository : IBaseRepository<Show>
    {
        Task<Show?> GetWithDetailsByIdAsync(Guid id);
    }
}
