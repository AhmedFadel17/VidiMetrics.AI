using VidiMetrics.DataAccess.Data;
using VidiMetrics.Domain.Models.Infra;
using VidiMetrics.DataAccess.Providers.Cashing;

namespace VidiMetrics.DataAccess.Repositories.Infra.SubscriptionPlans
{
    public class SubscriptionPlansRepository : BaseRepository<SubscriptionPlan>, ISubscriptionPlansRepository
    {
        public SubscriptionPlansRepository(AppDbContext context, ICacheProvider cacheProvider) : base(context, cacheProvider) { }
    }
}
