using VidiMetrics.DataAccess.Data;
using VidiMetrics.Domain.Models.Infra;

namespace VidiMetrics.DataAccess.Repositories.Infra.UserCreditWallets
{
    public class UserCreditWalletsRepository : BaseRepository<UserCreditWallet>, IUserCreditWalletsRepository
    {
        public UserCreditWalletsRepository(AppDbContext context) : base(context) { }
    }
}
