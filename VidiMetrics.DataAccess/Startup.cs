using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using VidiMetrics.DataAccess.Data;
using VidiMetrics.DataAccess.Repositories;
using VidiMetrics.DataAccess.Repositories.Core.Videos;
using VidiMetrics.DataAccess.Repositories.Ai.AiPromptTemplates;
using VidiMetrics.DataAccess.Repositories.Ai.AiTasks;
using VidiMetrics.DataAccess.Repositories.Ai.ShortsProjects;
using VidiMetrics.DataAccess.Repositories.Ai.Transcripts;
using VidiMetrics.DataAccess.Repositories.Core.Channels;
using VidiMetrics.DataAccess.Repositories.Core.LocalVideos;
using VidiMetrics.DataAccess.Repositories.Core.PlaylistItems;
using VidiMetrics.DataAccess.Repositories.Core.Playlists;
using VidiMetrics.DataAccess.Repositories.Core.YouTubeVideos;
using VidiMetrics.DataAccess.Repositories.Infra.ApiUsageQuotas;
using VidiMetrics.DataAccess.Repositories.Infra.UserAccounts;
using VidiMetrics.DataAccess.Repositories.Seo.CompetitorVideos;
using VidiMetrics.DataAccess.Repositories.Seo.KeywordRankings;
using VidiMetrics.DataAccess.Repositories.Seo.Keywords;
using VidiMetrics.DataAccess.Repositories.Seo.SeoAudits;
using VidiMetrics.DataAccess.Repositories.Seo.VideoTags;
using VidiMetrics.DataAccess.Repositories.StoryEngine.Characters;
using VidiMetrics.DataAccess.Repositories.StoryEngine.Environments;
using VidiMetrics.DataAccess.Repositories.StoryEngine.Episodes;
using VidiMetrics.DataAccess.Repositories.StoryEngine.Scenes;
using VidiMetrics.DataAccess.Repositories.StoryEngine.Series;

namespace VidiMetrics.DataAccess
{
    public static class Startup
    {
        public static Task<IServiceCollection> AddDataAccessServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<AppDbContext>(options => options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));
            services.AddScoped(typeof(IBaseRepository<>), typeof(BaseRepository<>));
            services.AddScoped<IVideosRepository, VideosRepository>();
            services.AddScoped<IAiPromptTemplatesRepository, AiPromptTemplatesRepository>();
            services.AddScoped<IAiTasksRepository, AiTasksRepository>();
            services.AddScoped<IShortsProjectsRepository, ShortsProjectsRepository>();
            services.AddScoped<ITranscriptsRepository, TranscriptsRepository>();
            services.AddScoped<IChannelsRepository, ChannelsRepository>();
            services.AddScoped<ILocalVideosRepository, LocalVideosRepository>();
            services.AddScoped<IPlaylistsRepository, PlaylistsRepository>();
            services.AddScoped<IPlaylistItemsRepository, PlaylistItemsRepository>();
            services.AddScoped<IYouTubeVideosRepository, YouTubeVideosRepository>();
            services.AddScoped<IApiUsageQuotasRepository, ApiUsageQuotasRepository>();
            services.AddScoped<IUserAccountsRepository, UserAccountsRepository>();
            services.AddScoped<ICompetitorVideosRepository, CompetitorVideosRepository>();
            services.AddScoped<IKeywordsRepository, KeywordsRepository>();
            services.AddScoped<IKeywordRankingsRepository, KeywordRankingsRepository>();
            services.AddScoped<ISeoAuditsRepository, SeoAuditsRepository>();
            services.AddScoped<IVideoTagsRepository, VideoTagsRepository>();
            services.AddScoped<ICharactersRepository, CharactersRepository>();
            services.AddScoped<IEnvironmentsRepository, EnvironmentsRepository>();
            services.AddScoped<IEpisodesRepository, EpisodesRepository>();
            services.AddScoped<IScenesRepository, ScenesRepository>();
            services.AddScoped<ISeriesRepository, SeriesRepository>();
            return Task.FromResult(services);
        }
    }
}

