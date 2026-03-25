
using VidiMetrics.Domain.Enums;

namespace VidiMetrics.Domain.Models.Infra
{
    public class ApiUsageQuota
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid UserAccountId { get; set; }

        public ApiType ApiType { get; set; } = ApiType.YouTube;

        public int MonthlyLimit { get; set; }
        public int CurrentUsage { get; set; }

        public DateTime PeriodStart { get; set; }
        public DateTime PeriodEnd { get; set; }

        public bool CanCallApi => CurrentUsage < MonthlyLimit;
    }
}
