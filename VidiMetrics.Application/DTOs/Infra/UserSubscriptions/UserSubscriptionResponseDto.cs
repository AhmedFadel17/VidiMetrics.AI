using System;
using VidiMetrics.Domain.Enums.Infra;

namespace VidiMetrics.Application.DTOs.Infra.UserSubscriptions
{
    public record UserSubscriptionResponseDto
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid PlanId { get; set; }
        public string PlanName { get; set; } = string.Empty;
        public string? StripeSubscriptionId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime CurrentPeriodStart { get; set; }
        public DateTime CurrentPeriodEnd { get; set; }
        public DateTime? CancelledAt { get; set; }
        public SubscriptionStatus Status { get; set; }
    }
}
