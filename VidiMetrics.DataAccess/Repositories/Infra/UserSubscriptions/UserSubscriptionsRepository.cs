using VidiMetrics.DataAccess.Data;
using VidiMetrics.Domain.Models.Infra;

namespace VidiMetrics.DataAccess.Repositories.Infra.UserSubscriptions
{
    public class UserSubscriptionsRepository : BaseRepository<UserSubscription>, IUserSubscriptionsRepository
    {
        public UserSubscriptionsRepository(AppDbContext context) : base(context) { }
    }
}
