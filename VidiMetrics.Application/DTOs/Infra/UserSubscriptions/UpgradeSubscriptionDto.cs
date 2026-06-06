using System;

namespace VidiMetrics.Application.DTOs.Infra.UserSubscriptions
{
    public record UpgradeSubscriptionDto
    {
        public Guid PlanId { get; set; }
    }
}
