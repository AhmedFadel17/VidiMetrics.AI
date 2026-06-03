using VidiMetrics.DataAccess.Data;
using VidiMetrics.Domain.Models.Infra;

namespace VidiMetrics.DataAccess.Repositories.Infra.CreditCostRules;

public class CreditCostRulesRepository : BaseRepository<CreditCostRule>, ICreditCostRulesRepository
{
    public CreditCostRulesRepository(AppDbContext context) : base(context) { }
}
