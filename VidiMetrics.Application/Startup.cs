using System;
using System.Threading.Tasks;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using VidiMetrics.Application.Interfaces.Ai;
using VidiMetrics.Application.Interfaces.Core;
using VidiMetrics.Application.Interfaces.Infra;
using VidiMetrics.Application.Interfaces.Seo;
using VidiMetrics.Application.Interfaces.StoryEngine;
using VidiMetrics.Application.Providers.ChannelPlatformProviders;
using VidiMetrics.Application.Providers.ImageProviders;
using VidiMetrics.Application.Providers.StorageProviders;
using VidiMetrics.Application.Providers.VideoProviders;
using VidiMetrics.Application.Services.Ai;
using VidiMetrics.Application.Services.Core;
using VidiMetrics.Application.Services.Infra;
using VidiMetrics.Application.Services.Seo;
using VidiMetrics.Application.Services.StoryEngine;
using VidiMetrics.Application.Validators.Core.Channels;

namespace VidiMetrics.Application
{
    public static class Startup
    {
        public static Task<IServiceCollection> AddApplicationServices(this IServiceCollection services)
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
            services.AddScoped<IStoryEnvironmentsService, StoryEnvironmentsService>();
            services.AddScoped<ITranscriptsService, TranscriptsService>();
            services.AddScoped<IUserProfilesService, UserProfilesService>();
            services.AddScoped<ISubscriptionPlansService, SubscriptionPlansService>();
            services.AddScoped<IUserSubscriptionsService, UserSubscriptionsService>();
            services.AddScoped<ICreditTransactionManager, CreditTransactionManager>();
            services.AddScoped<IVideoTagsService, VideoTagsService>();

            services.AddScoped<IImageProvider, PollinationsImageProvider>();
            services.AddScoped<IVideoProvider, PollinationsVideoProvider>();
            services.AddScoped<IStorageProvider, CloudinaryStorageProvider>();
            services.AddScoped<IChannelPlatformProvider, YouTubePlatformProvider>();
            services.AddScoped<IChannelPlatformProvider, TikTokPlatformProvider>();

            return Task.FromResult(services);
        }
    }
}
