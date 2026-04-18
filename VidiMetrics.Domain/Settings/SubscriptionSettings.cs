
namespace VidiMetrics.Domain.Settings
{
    public class SubscriptionSettings
    {
        public PlanSettings FreePlan { get; set; } = new();
    }

    public class PlanSettings
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal MonthlyPrice { get; set; }
        public int MaxChannelsAllowed { get; set; }
        public int DailyApiQuotaLimit { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
