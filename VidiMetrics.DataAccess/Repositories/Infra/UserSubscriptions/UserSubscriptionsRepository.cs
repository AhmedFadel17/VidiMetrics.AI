using VidiMetrics.DataAccess.Data;
using VidiMetrics.Domain.Models.Infra;
using VidiMetrics.DataAccess.Providers.Cashing;

namespace VidiMetrics.DataAccess.Repositories.Infra.UserSubscriptions
{
    public class UserSubscriptionsRepository : BaseRepository<UserSubscription>, IUserSubscriptionsRepository
    {
        public UserSubscriptionsRepository(AppDbContext context, ICacheProvider cacheProvider) : base(context, cacheProvider) { }
    }
}
