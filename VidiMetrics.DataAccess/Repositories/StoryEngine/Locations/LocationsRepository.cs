using VidiMetrics.DataAccess.Data;
using VidiMetrics.DataAccess.Providers.Cashing;
using VidiMetrics.Domain.Models.StoryEngine;

namespace VidiMetrics.DataAccess.Repositories.StoryEngine.Locations
{
    public class LocationsRepository : BaseRepository<Location>, ILocationsRepository
    {
        public LocationsRepository(AppDbContext context, ICacheProvider cacheProvider) : base(context, cacheProvider) { }
    }
}
