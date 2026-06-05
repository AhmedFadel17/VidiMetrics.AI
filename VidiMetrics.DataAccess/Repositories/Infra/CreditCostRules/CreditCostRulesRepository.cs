using VidiMetrics.DataAccess.Data;
using VidiMetrics.Domain.Models.Infra;
using VidiMetrics.DataAccess.Providers.Cashing;

namespace VidiMetrics.DataAccess.Repositories.Infra.CreditCostRules;

public class CreditCostRulesRepository : BaseRepository<CreditCostRule>, ICreditCostRulesRepository
{
    public CreditCostRulesRepository(AppDbContext context, ICacheProvider cacheProvider) : base(context, cacheProvider) { }
}
