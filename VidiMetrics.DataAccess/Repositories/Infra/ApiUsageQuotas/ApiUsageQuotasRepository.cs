using VidiMetrics.DataAccess.Data;
using VidiMetrics.Domain.Models.Infra;

namespace VidiMetrics.DataAccess.Repositories.Infra.ApiUsageQuotas
{
    public class ApiUsageQuotasRepository : BaseRepository<ApiUsageQuota>, IApiUsageQuotasRepository
    {
        public ApiUsageQuotasRepository(AppDbContext context) : base(context) { }
    }
}
