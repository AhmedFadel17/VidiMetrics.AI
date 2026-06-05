using VidiMetrics.DataAccess.Data;
using VidiMetrics.Domain.Models.Infra;
using VidiMetrics.DataAccess.Providers.Cashing;

namespace VidiMetrics.DataAccess.Repositories.Infra.UserCreditWallets
{
    public class UserCreditWalletsRepository : BaseRepository<UserCreditWallet>, IUserCreditWalletsRepository
    {
        public UserCreditWalletsRepository(AppDbContext context, ICacheProvider cacheProvider) : base(context, cacheProvider) { }
    }
}
