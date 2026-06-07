using VidiMetrics.DataAccess.Data;
using VidiMetrics.DataAccess.Providers.Cashing;
using VidiMetrics.Domain.Models.Infra;

namespace VidiMetrics.DataAccess.Repositories.Infra.Notifications;


public class NotificationsRepository : BaseRepository<Notification>,
INotificationsRepository
{
    public NotificationsRepository(AppDbContext context, ICacheProvider cacheProvider)
        : base(context, cacheProvider)
    {
    }
}
