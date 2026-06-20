using VidiMetrics.Domain.Enums.Infra;

namespace VidiMetrics.Domain.Models.Infra;

public class UserSubscription
{
    public Guid Id { get; set; } = Guid.NewGuid();


    public Guid UserId { get; set; }
    public UserProfile UserProfile { get; set; } = null!;

    public Guid PlanId { get; set; }
    public SubscriptionPlan SubscriptionPlan { get; set; } = null!;

    public string? StripeSubscriptionId { get; set; }
    public DateTime CurrentPeriodStart { get; set; } = DateTime.UtcNow;
    public DateTime CurrentPeriodEnd { get; set; } = DateTime.UtcNow.AddMonths(1);
    public DateTime StartDate { get; set; } = DateTime.UtcNow;
    public DateTime? CancelledAt { get; set; }


    public SubscriptionStatus Status { get; set; } = SubscriptionStatus.Active;
}