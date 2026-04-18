using VidiMetrics.Domain.Enums;

namespace VidiMetrics.Domain.Models.Infra;

public class UserSubscription
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid UserId { get; set; }
    public UserProfile UserProfile { get; set; } = null!;

    public Guid PlanId { get; set; }
    public SubscriptionPlan SubscriptionPlan { get; set; } = null!;

    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    
    public SubscriptionStatus Status { get; set; } = SubscriptionStatus.Active;
}
