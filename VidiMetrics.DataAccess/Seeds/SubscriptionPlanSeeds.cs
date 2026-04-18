using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using VidiMetrics.Domain.Models.Infra;
using VidiMetrics.Domain.Settings;

namespace VidiMetrics.DataAccess.Seeds
{
    public static class SubscriptionPlanSeeds
    {
        public static void SeedSubscriptionPlans(this ModelBuilder modelBuilder, IConfiguration configuration)
        {
            var section = configuration.GetSection("SubscriptionSettings");
            var freePlanSettings = section.GetSection("FreePlan").Get<PlanSettings>();

            if (freePlanSettings != null && !string.IsNullOrEmpty(freePlanSettings.Id))
            {
                modelBuilder.Entity<SubscriptionPlan>().HasData(new SubscriptionPlan
                {
                    Id = Guid.Parse(freePlanSettings.Id),
                    Name = freePlanSettings.Name,
                    Description = freePlanSettings.Description,
                    MonthlyPrice = freePlanSettings.MonthlyPrice,
                    MaxChannelsAllowed = freePlanSettings.MaxChannelsAllowed,
                    DailyApiQuotaLimit = freePlanSettings.DailyApiQuotaLimit,
                    IsActive = freePlanSettings.IsActive
                });
            }
        }
    }
}
