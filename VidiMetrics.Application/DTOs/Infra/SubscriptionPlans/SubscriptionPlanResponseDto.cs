using System;

namespace VidiMetrics.Application.DTOs.Infra.SubscriptionPlans
{
    public record SubscriptionPlanResponseDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal MonthlyPrice { get; set; }
        public int MaxChannelsAllowed { get; set; }
        public int BaseMonthlyCredits { get; set; }
        public string? StripePriceId { get; set; }
        public bool IsActive { get; set; }
    }
}
