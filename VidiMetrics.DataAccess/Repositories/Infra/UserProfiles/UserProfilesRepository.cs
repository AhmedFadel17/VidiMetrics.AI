using VidiMetrics.DataAccess.Data;
using VidiMetrics.Domain.Models.Infra;

namespace VidiMetrics.DataAccess.Repositories.Infra.UserProfiles
{
    public class UserProfilesRepository : BaseRepository<UserProfile>, IUserProfilesRepository
    {
        public UserProfilesRepository(AppDbContext context) : base(context) { }
    }
}
