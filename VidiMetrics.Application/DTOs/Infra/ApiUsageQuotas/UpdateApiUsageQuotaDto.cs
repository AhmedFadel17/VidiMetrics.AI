using VidiMetrics.Domain.Enums;

namespace VidiMetrics.Application.DTOs.Infra.ApiUsageQuotas
{
    public class UpdateApiUsageQuotaDto
    {
        public Guid UserAccountId { get; set; }
        public ApiType ApiType { get; set; }
        public int MonthlyLimit { get; set; }
        public int CurrentUsage { get; set; }
        public DateTime PeriodStart { get; set; }
        public DateTime PeriodEnd { get; set; }
    }
}
