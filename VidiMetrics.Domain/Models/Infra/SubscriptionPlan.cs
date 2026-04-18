namespace VidiMetrics.Domain.Models.Infra;

public class SubscriptionPlan
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal MonthlyPrice { get; set; }
    public int MaxChannelsAllowed { get; set; }
    public int DailyApiQuotaLimit { get; set; }
    public bool IsActive { get; set; } = true;
    
    public ICollection<UserProfile> UserProfiles { get; set; } = new List<UserProfile>();
    public ICollection<UserSubscription> UserSubscriptions { get; set; } = new List<UserSubscription>();
}
