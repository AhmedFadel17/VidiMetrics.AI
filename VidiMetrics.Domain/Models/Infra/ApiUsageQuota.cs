
namespace VidiMetrics.Domain.Models.Infra
{
    internal class ApiUsageQuota
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid UserAccountId { get; set; }

        public string ApiType { get; set; } = string.Empty;

        public int MonthlyLimit { get; set; }
        public int CurrentUsage { get; set; }

        public DateTime PeriodStart { get; set; }
        public DateTime PeriodEnd { get; set; }

        public bool CanCallApi => CurrentUsage < MonthlyLimit;
    }
}
