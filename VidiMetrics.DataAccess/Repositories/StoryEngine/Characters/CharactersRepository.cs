using VidiMetrics.DataAccess.Data;
using VidiMetrics.Domain.Models.StoryEngine;
using VidiMetrics.DataAccess.Providers.Cashing;

namespace VidiMetrics.DataAccess.Repositories.StoryEngine.Characters
{
    public class CharactersRepository : BaseRepository<Character>, ICharactersRepository
    {
        public CharactersRepository(AppDbContext context, ICacheProvider cacheProvider) : base(context, cacheProvider) { }
    }
}
