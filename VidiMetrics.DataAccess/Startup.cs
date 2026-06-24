using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using VidiMetrics.DataAccess.Data;
using VidiMetrics.DataAccess.Providers.Cashing;
using VidiMetrics.DataAccess.Repositories;
using VidiMetrics.DataAccess.Repositories.Ai.AiImages;
using VidiMetrics.DataAccess.Repositories.Ai.AiScripts;
using VidiMetrics.DataAccess.Repositories.Ai.AiVideos;
using VidiMetrics.DataAccess.Repositories.Copilot.CopilotChats;
using VidiMetrics.DataAccess.Repositories.Copilot.CopilotDrafts;
using VidiMetrics.DataAccess.Repositories.Copilot.CopilotMessages;
using VidiMetrics.DataAccess.Repositories.Core.Channels;
using VidiMetrics.DataAccess.Repositories.Core.ChannelsPosts;
using VidiMetrics.DataAccess.Repositories.Core.ChannelStats;
using VidiMetrics.DataAccess.Repositories.Infra.CreditCostRules;
using VidiMetrics.DataAccess.Repositories.Infra.CreditTransactionLedgers;
using VidiMetrics.DataAccess.Repositories.Infra.Notifications;
using VidiMetrics.DataAccess.Repositories.Infra.SubscriptionPlans;
using VidiMetrics.DataAccess.Repositories.Infra.UserCreditWallets;
using VidiMetrics.DataAccess.Repositories.Infra.UserProfiles;
using VidiMetrics.DataAccess.Repositories.Infra.UserSubscriptions;
using VidiMetrics.DataAccess.Repositories.StoryEngine.Characters;
using VidiMetrics.DataAccess.Repositories.StoryEngine.Episodes;
using VidiMetrics.DataAccess.Repositories.StoryEngine.Locations;
using VidiMetrics.DataAccess.Repositories.StoryEngine.Scenes;
using VidiMetrics.DataAccess.Repositories.StoryEngine.Shows;
namespace VidiMetrics.DataAccess
{
    public static class Startup
    {
        public static Task<IServiceCollection> AddDataAccessServices(this IServiceCollection services, IConfiguration configuration)
        {

            // Database Context
            services.AddDbContext<AppDbContext>(options =>
            {
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"));
                options.ConfigureWarnings(w => w.Ignore(RelationalEventId.PendingModelChangesWarning));
            });

            // Caching
            services.AddStackExchangeRedisCache(options =>
            {
                options.Configuration = configuration.GetConnectionString("RedisConnection") ?? "localhost:6379";
                options.InstanceName = "VidiMetrics_";
            });

            // Generic Repository
            services.AddScoped(typeof(IBaseRepository<>), typeof(BaseRepository<>));

            // Copilot Repositories
            services.AddScoped<ICopilotChatsRepository, CopilotChatsRepository>();
            services.AddScoped<ICopilotMessagesRepository, CopilotMessagesRepository>();
            services.AddScoped<ICopilotDraftsRepository, CopilotDraftsRepository>();


            // AI Repositories
            services.AddScoped<IAiImagesRepository, AiImagesRepository>();
            services.AddScoped<IAiScriptsRepository, AiScriptsRepository>();
            services.AddScoped<IAiVideosRepository, AiVideosRepository>();

            // Core Repositories
            services.AddScoped<IChannelsRepository, ChannelsRepository>();
            services.AddScoped<IChannelPostsRepository, ChannelPostsRepository>();
            services.AddScoped<IChannelStatsRepository, ChannelStatsRepository>();

            // Infra Repositories
            services.AddScoped<IUserProfilesRepository, UserProfilesRepository>();
            services.AddScoped<ISubscriptionPlansRepository, SubscriptionPlansRepository>();
            services.AddScoped<IUserSubscriptionsRepository, UserSubscriptionsRepository>();
            services.AddScoped<IUserCreditWalletsRepository, UserCreditWalletsRepository>();
            services.AddScoped<ICreditCostRulesRepository, CreditCostRulesRepository>();
            services.AddScoped<INotificationsRepository, NotificationsRepository>();
            services.AddScoped<ICreditTransactionLedgersRepository, CreditTransactionLedgersRepository>();

            // StoryEngine Repositories
            services.AddScoped<ICharactersRepository, CharactersRepository>();
            services.AddScoped<ILocationsRepository, LocationsRepository>();
            services.AddScoped<IEpisodesRepository, EpisodesRepository>();
            services.AddScoped<IScenesRepository, ScenesRepository>();
            services.AddScoped<IShowsRepository, ShowsRepository>();

            // Providers
            services.AddScoped<ICacheProvider, RedisCacheProvider>();


            return Task.FromResult(services);
        }
    }
}
