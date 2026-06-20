using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using VidiMetrics.DataAccess.Data;
using VidiMetrics.Domain.Enums.Infra;
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

            await context.Database.MigrateAsync();

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
                        BaseMonthlyCredits = freePlanSettings.BaseMonthlyCredits,
                        StripePriceId = freePlanSettings.StripePriceId,
                        IsActive = freePlanSettings.IsActive
                    };

                    await context.SubscriptionPlans.AddAsync(freePlan);
                    await context.SaveChangesAsync();
                }
            }

            await SeedCreditCostRulesAsync(context);
        }

        private static async Task SeedCreditCostRulesAsync(AppDbContext context)
        {
            var defaultRules = new List<CreditCostRule>
            {
                new() { ActionType = CreditActionType.GenerateImage, CreditCost = 100, IsEnabled = true },
                new() { ActionType = CreditActionType.GenerateVideo, CreditCost = 500, IsEnabled = true },
                new() { ActionType = CreditActionType.RenderScene, CreditCost = 300, IsEnabled = true },
                new() { ActionType = CreditActionType.UpscaleAsset, CreditCost = 50, IsEnabled = true },
                new() { ActionType = CreditActionType.AiVoiceover, CreditCost = 150, IsEnabled = true }
            };

            bool changesMade = false;

            foreach (var rule in defaultRules)
            {
                var exists = await context.CreditCostRules.AnyAsync(r => r.ActionType == rule.ActionType);


                if (!exists)
                {
                    await context.CreditCostRules.AddAsync(rule);
                    changesMade = true;
                }
            }

            if (changesMade)
            {
                await context.SaveChangesAsync();
            }
        }
    }
}