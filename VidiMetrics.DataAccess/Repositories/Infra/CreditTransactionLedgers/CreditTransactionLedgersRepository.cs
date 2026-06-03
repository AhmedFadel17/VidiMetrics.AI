using VidiMetrics.DataAccess.Data;
using VidiMetrics.Domain.Models.Infra;

namespace VidiMetrics.DataAccess.Repositories.Infra.CreditTransactionLedgers
{
    public class CreditTransactionLedgersRepository : BaseRepository<CreditTransactionLedger>, ICreditTransactionLedgersRepository
    {
        public CreditTransactionLedgersRepository(AppDbContext context) : base(context) { }
    }
}
