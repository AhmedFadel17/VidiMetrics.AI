using VidiMetrics.DataAccess.Data;
using VidiMetrics.Domain.Models.StoryEngine;

namespace VidiMetrics.DataAccess.Repositories.StoryEngine.Characters
{
    public class CharactersRepository : BaseRepository<Character>, ICharactersRepository
    {
        public CharactersRepository(AppDbContext context) : base(context) { }
    }
}
