using VidiMetrics.DataAccess.Data;
using VidiMetrics.Domain.Models.Infra;
using VidiMetrics.DataAccess.Providers.Cashing;

namespace VidiMetrics.DataAccess.Repositories.Infra.CreditTransactionLedgers
{
    public class CreditTransactionLedgersRepository : BaseRepository<CreditTransactionLedger>, ICreditTransactionLedgersRepository
    {
        public CreditTransactionLedgersRepository(AppDbContext context, ICacheProvider cacheProvider) : base(context,cacheProvider) { }
    }
}
