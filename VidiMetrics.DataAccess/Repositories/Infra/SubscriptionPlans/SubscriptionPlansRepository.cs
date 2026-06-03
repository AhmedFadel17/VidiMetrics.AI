using VidiMetrics.DataAccess.Data;
using VidiMetrics.Domain.Models.Infra;

namespace VidiMetrics.DataAccess.Repositories.Infra.SubscriptionPlans
{
    public class SubscriptionPlansRepository : BaseRepository<SubscriptionPlan>, ISubscriptionPlansRepository
    {
        public SubscriptionPlansRepository(AppDbContext context) : base(context) { }
    }
}
