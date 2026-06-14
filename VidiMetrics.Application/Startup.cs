using System;
using System.ClientModel;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using FluentValidation;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using OpenAI;
using OpenAI.Chat;
using VidiMetrics.Application.Interfaces.Ai;
using VidiMetrics.Application.Interfaces.Copilot;
using VidiMetrics.Application.Interfaces.Core;
using VidiMetrics.Application.Interfaces.Infra;
using VidiMetrics.Application.Interfaces.Seo;
using VidiMetrics.Application.Interfaces.StoryEngine;
using VidiMetrics.Application.Providers.ChannelPlatformProviders;
using VidiMetrics.Application.Providers.Copilot;
using VidiMetrics.Application.Providers.ImageProviders;
using VidiMetrics.Application.Providers.NotificationsProviders;
using VidiMetrics.Application.Providers.StorageProviders;
using VidiMetrics.Application.Providers.VideoProviders;
using VidiMetrics.Application.Services.Ai;
using VidiMetrics.Application.Services.Copilot;
using VidiMetrics.Application.Services.Core;
using VidiMetrics.Application.Services.Infra;
using VidiMetrics.Application.Services.Seo;
using VidiMetrics.Application.Services.StoryEngine;
using VidiMetrics.Application.Validators.Core.Channels;
using VidiMetrics.Domain.Settings;
namespace VidiMetrics.Application
{
    public static class Startup
    {
        public static Task<IServiceCollection> AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
        {
            // AutoMapper Registration
            services.AddAutoMapper(cfg => { }, AppDomain.CurrentDomain.GetAssemblies());

            // Automatic Validator Registration
            services.AddValidatorsFromAssemblyContaining<CreateChannelValidator>();

            // Service Registration
            services.AddScoped<IAiPromptTemplatesService, AiPromptTemplatesService>();
            services.AddScoped<IAiTasksService, AiTasksService>();
            services.AddScoped<IAiImagesService, AiImagesService>();
            services.AddScoped<IAiScriptsService, AiScriptsService>();
            services.AddScoped<IAiVideosService, AiVideosService>();
            services.AddScoped<IChannelsService, ChannelsService>();
            services.AddScoped<ICharactersService, CharactersService>();
            services.AddScoped<ICompetitorVideosService, CompetitorVideosService>();
            services.AddScoped<IEpisodesService, EpisodesService>();
            services.AddScoped<IKeywordRankingsService, KeywordRankingsService>();
            services.AddScoped<IKeywordsService, KeywordsService>();
            services.AddScoped<ISeoAuditsService, SeoAuditsService>();

            services.AddScoped<IShowsService, ShowsService>();
            services.AddScoped<IScenesService, ScenesService>();
            services.AddScoped<ILocationsService, LocationsService>();
            services.AddScoped<ITranscriptsService, TranscriptsService>();
            services.AddScoped<IUserProfilesService, UserProfilesService>();
            services.AddScoped<ISubscriptionPlansService, SubscriptionPlansService>();
            services.AddScoped<IUserSubscriptionsService, UserSubscriptionsService>();
            services.AddScoped<ICreditTransactionManager, CreditTransactionManager>();
            services.AddScoped<INotificationsService, NotificationsService>();
            services.AddScoped<IVideoTagsService, VideoTagsService>();

            services.AddScoped<IImageProvider, PollinationsImageProvider>();
            services.AddScoped<IVideoProvider, PollinationsVideoProvider>();
            services.AddScoped<IStorageProvider, CloudinaryStorageProvider>();
            services.AddScoped<IChannelPlatformProvider, YouTubePlatformProvider>();
            services.AddScoped<IChannelPlatformProvider, TikTokPlatformProvider>();

            services.AddSignalR();
            services.AddScoped<INotificationProvider, NotificationProvider>();


            services.AddScoped<ICopilotPromptBuilder, CopilotPromptBuilder>();
            services.AddScoped<ICopilotAiProvider, CopilotAiProvider>();
            services.AddScoped<ICopilotExecutionRouter, CopilotExecutionRouter>();
            services.AddScoped<ICopilotService, CopilotService>();
            services.AddScoped<ICopilotPayloadValidationService, CopilotPayloadValidationService>();
            var apisSettings = configuration.GetSection("ApisSettings").Get<ApisSettings>();

            services.AddHttpClient<ICopilotAiProvider, CopilotAiProvider>((sp, client) =>
            {
                client.BaseAddress = new Uri(apisSettings?.Pollinations.BaseUrl ?? "https://gen.pollinations.ai");
                client.DefaultRequestHeaders.Authorization =
                    new AuthenticationHeaderValue("Bearer", apisSettings?.Pollinations.ApiKey ?? string.Empty);
            });
            return Task.FromResult(services);
        }
    }
}
