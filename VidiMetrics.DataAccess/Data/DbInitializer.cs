using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using VidiMetrics.DataAccess.Data;
using VidiMetrics.Domain.Models.Infra;
using VidiMetrics.Domain.Settings;

namespace VidiMetrics.DataAccess.Data
{
    public static class DbInitializer
    {
        public static async Task SeedAsync(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var configuration = scope.ServiceProvider.GetRequiredService<IConfiguration>();

            // Ensure migrations are applied
            await context.Database.MigrateAsync();

            // Seed Subscription Plans from Configuration
            var section = configuration.GetSection("SubscriptionSettings");
            var freePlanSettings = section.GetSection("FreePlan").Get<PlanSettings>();

            if (freePlanSettings != null && !string.IsNullOrEmpty(freePlanSettings.Id))
            {
                var planId = Guid.Parse(freePlanSettings.Id);
                var existingPlan = await context.SubscriptionPlans.AnyAsync(p => p.Id == planId);

                if (!existingPlan)
                {
                    var freePlan = new SubscriptionPlan
                    {
                        Id = planId,
                        Name = freePlanSettings.Name,
                        Description = freePlanSettings.Description,
                        MonthlyPrice = freePlanSettings.MonthlyPrice,
                        MaxChannelsAllowed = freePlanSettings.MaxChannelsAllowed,
                        DailyApiQuotaLimit = freePlanSettings.DailyApiQuotaLimit,
                        IsActive = freePlanSettings.IsActive
                    };

                    await context.SubscriptionPlans.AddAsync(freePlan);
                    await context.SaveChangesAsync();
                }
            }
        }
    }
}
