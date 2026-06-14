using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using VidiMetrics.DataAccess.Data;
using VidiMetrics.DataAccess.Providers.Cashing;
using VidiMetrics.DataAccess.Repositories;

using VidiMetrics.DataAccess.Repositories.Ai.AiImages;
using VidiMetrics.DataAccess.Repositories.Ai.AiPromptTemplates;
using VidiMetrics.DataAccess.Repositories.Ai.AiScripts;
using VidiMetrics.DataAccess.Repositories.Ai.AiTasks;
using VidiMetrics.DataAccess.Repositories.Ai.AiVideos;
using VidiMetrics.DataAccess.Repositories.Ai.Transcripts;
using VidiMetrics.DataAccess.Repositories.Copilot.CopilotChats;
using VidiMetrics.DataAccess.Repositories.Copilot.CopilotDrafts;
using VidiMetrics.DataAccess.Repositories.Copilot.CopilotMessages;
using VidiMetrics.DataAccess.Repositories.Core.Channels;
using VidiMetrics.DataAccess.Repositories.Core.ChannelsPosts;
using VidiMetrics.DataAccess.Repositories.Core.ChannelStats;
using VidiMetrics.DataAccess.Repositories.Core.Videos;
using VidiMetrics.DataAccess.Repositories.Infra.CreditCostRules;
using VidiMetrics.DataAccess.Repositories.Infra.CreditTransactionLedgers;
using VidiMetrics.DataAccess.Repositories.Infra.Notifications;
using VidiMetrics.DataAccess.Repositories.Infra.SubscriptionPlans;
using VidiMetrics.DataAccess.Repositories.Infra.UserCreditWallets;
using VidiMetrics.DataAccess.Repositories.Infra.UserProfiles;
using VidiMetrics.DataAccess.Repositories.Infra.UserSubscriptions;
using VidiMetrics.DataAccess.Repositories.Seo.CompetitorVideos;
using VidiMetrics.DataAccess.Repositories.Seo.KeywordRankings;
using VidiMetrics.DataAccess.Repositories.Seo.Keywords;
using VidiMetrics.DataAccess.Repositories.Seo.SeoAudits;
using VidiMetrics.DataAccess.Repositories.Seo.VideoTags;
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
            services.AddDbContext<AppDbContext>(options => options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));
            services.AddStackExchangeRedisCache(options =>
            {
                options.Configuration = configuration.GetConnectionString("RedisConnection") ?? "localhost:6379";
                options.InstanceName = "VidiMetrics_";
            });
            services.AddScoped(typeof(IBaseRepository<>), typeof(BaseRepository<>));

            services.AddScoped<ICopilotChatsRepository, CopilotChatsRepository>();
            services.AddScoped<ICopilotMessagesRepository, CopilotMessagesRepository>();
            services.AddScoped<ICopilotDraftsRepository, CopilotDraftsRepository>();

            services.AddScoped<IAiPromptTemplatesRepository, AiPromptTemplatesRepository>();
            services.AddScoped<IAiTasksRepository, AiTasksRepository>();
            services.AddScoped<IAiImagesRepository, AiImagesRepository>();
            services.AddScoped<IAiScriptsRepository, AiScriptsRepository>();
            services.AddScoped<IAiVideosRepository, AiVideosRepository>();
            services.AddScoped<ITranscriptsRepository, TranscriptsRepository>();
            services.AddScoped<IChannelsRepository, ChannelsRepository>();
            services.AddScoped<IChannelPostsRepository, ChannelPostsRepository>();
            services.AddScoped<IChannelStatsRepository, ChannelStatsRepository>();
            services.AddScoped<IVideosRepository, VideosRepository>();

            services.AddScoped<IUserProfilesRepository, UserProfilesRepository>();
            services.AddScoped<ISubscriptionPlansRepository, SubscriptionPlansRepository>();
            services.AddScoped<IUserSubscriptionsRepository, UserSubscriptionsRepository>();
            services.AddScoped<IUserCreditWalletsRepository, UserCreditWalletsRepository>();
            services.AddScoped<ICreditCostRulesRepository, CreditCostRulesRepository>();
            services.AddScoped<INotificationsRepository, NotificationsRepository>();

            services.AddScoped<ICreditTransactionLedgersRepository, CreditTransactionLedgersRepository>();
            services.AddScoped<ICompetitorVideosRepository, CompetitorVideosRepository>();
            services.AddScoped<IKeywordsRepository, KeywordsRepository>();
            services.AddScoped<IKeywordRankingsRepository, KeywordRankingsRepository>();
            services.AddScoped<ISeoAuditsRepository, SeoAuditsRepository>();
            services.AddScoped<IVideoTagsRepository, VideoTagsRepository>();
            services.AddScoped<ICharactersRepository, CharactersRepository>();
            services.AddScoped<ILocationsRepository, LocationsRepository>();
            services.AddScoped<IEpisodesRepository, EpisodesRepository>();
            services.AddScoped<IScenesRepository, ScenesRepository>();
            services.AddScoped<IShowsRepository, ShowsRepository>();

            services.AddScoped<ICacheProvider, RedisCacheProvider>();
            return Task.FromResult(services);
        }
    }
}
