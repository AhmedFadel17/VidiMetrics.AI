using VidiMetrics.DataAccess.Data;
using VidiMetrics.Domain.Models.Infra;

namespace VidiMetrics.DataAccess.Repositories.Infra.UserAccounts
{
    public class UserAccountsRepository : BaseRepository<UserAccount>, IUserAccountsRepository
    {
        public UserAccountsRepository(AppDbContext context) : base(context) { }
    }
}
