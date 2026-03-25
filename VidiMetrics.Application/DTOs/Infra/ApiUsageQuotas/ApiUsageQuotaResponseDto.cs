using VidiMetrics.Domain.Enums;

namespace VidiMetrics.Application.DTOs.Infra.ApiUsageQuotas
{
    public class ApiUsageQuotaResponseDto
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? CreatedBy { get; set; }
        public bool IsDeleted { get; set; }
        public Guid UserAccountId { get; set; }
        public ApiType ApiType { get; set; }
        public int MonthlyLimit { get; set; }
        public int CurrentUsage { get; set; }
        public DateTime PeriodStart { get; set; }
        public DateTime PeriodEnd { get; set; }
    }
}
