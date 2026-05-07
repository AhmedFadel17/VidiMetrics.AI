using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using System.Threading.Tasks;
using System;
using VidiMetrics.Application.Interfaces.Ai;

using VidiMetrics.Application.Interfaces.Core;
using VidiMetrics.Application.Interfaces.Infra;
using VidiMetrics.Application.Interfaces.Seo;
using VidiMetrics.Application.Interfaces.StoryEngine;
using VidiMetrics.Application.Services.Ai;

using VidiMetrics.Application.Services.Core;
using VidiMetrics.Application.Services.Infra;
using VidiMetrics.Application.Services.Seo;
using VidiMetrics.Application.Services.StoryEngine;
using VidiMetrics.Application.Validators.Core.Videos;

namespace VidiMetrics.Application
{
    public static class Startup
    {
        public static Task<IServiceCollection> AddApplicationServices(this IServiceCollection services)
        {
            // AutoMapper Registration
            services.AddAutoMapper(cfg => { }, AppDomain.CurrentDomain.GetAssemblies());

            // Automatic Validator Registration
            services.AddValidatorsFromAssemblyContaining<CreateVideoValidator>();

            // Service Registration
            services.AddScoped<IVideosService, VideosService>();
            services.AddScoped<IAiPromptTemplatesService, AiPromptTemplatesService>();
            services.AddScoped<IAiTasksService, AiTasksService>();
            services.AddScoped<IApiUsageQuotasService, ApiUsageQuotasService>();
            services.AddScoped<IChannelsService, ChannelsService>();
            services.AddScoped<ICharactersService, CharactersService>();
            services.AddScoped<ICompetitorVideosService, CompetitorVideosService>();
            services.AddScoped<IEpisodesService, EpisodesService>();
            services.AddScoped<IKeywordRankingsService, KeywordRankingsService>();
            services.AddScoped<IKeywordsService, KeywordsService>();
            services.AddScoped<ILocalVideosService, LocalVideosService>();
            services.AddScoped<IPlaylistItemsService, PlaylistItemsService>();
            services.AddScoped<IPlaylistsService, PlaylistsService>();
            services.AddScoped<ISeoAuditsService, SeoAuditsService>();

            services.AddScoped<IShortsProjectsService, ShortsProjectsService>();
            services.AddScoped<IShowsService, ShowsService>();
            services.AddScoped<IScenesService, ScenesService>();
            services.AddScoped<IStoryEnvironmentsService, StoryEnvironmentsService>();
            services.AddScoped<ITranscriptsService, TranscriptsService>();
            services.AddScoped<IUserProfilesService, UserProfilesService>();
            services.AddScoped<IVideoTagsService, VideoTagsService>();
            services.AddScoped<IYouTubeVideosService, YouTubeVideosService>();

            return Task.FromResult(services);
        }
    }
}
