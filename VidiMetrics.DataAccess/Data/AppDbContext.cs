using Microsoft.EntityFrameworkCore;
using VidiMetrics.Domain.Models.Core;
using VidiMetrics.Domain.Models.Ai;
using VidiMetrics.Domain.Models.Infra;
using VidiMetrics.Domain.Models.Seo;
using VidiMetrics.Domain.Models.StoryEngine;

namespace VidiMetrics.DataAccess.Data
{
    public class AppDbContext : DbContext
    {
        // Core
        public DbSet<Video> Videos { get; set; }
        public DbSet<Channel> Channels { get; set; }
        public DbSet<Playlist> Playlists { get; set; }
        public DbSet<PlaylistItem> PlaylistItems { get; set; }
        public DbSet<LocalVideo> LocalVideos { get; set; }
        public DbSet<YouTubeVideo> YouTubeVideos { get; set; }

        // Ai
        public DbSet<AiPromptTemplate> AiPromptTemplates { get; set; }
        public DbSet<AiTask> AiTasks { get; set; }
        public DbSet<ShortsProject> ShortsProjects { get; set; }
        public DbSet<Transcript> Transcripts { get; set; }

        // Infra
        public DbSet<ApiUsageQuota> ApiUsageQuotas { get; set; }
        public DbSet<UserAccount> UserAccounts { get; set; }

        // Seo
        public DbSet<CompetitorVideo> CompetitorVideos { get; set; }
        public DbSet<Keyword> Keywords { get; set; }
        public DbSet<KeywordRanking> KeywordRankings { get; set; }
        public DbSet<SeoAudit> SeoAudits { get; set; }
        public DbSet<VideoTag> VideoTags { get; set; }

        // StoryEngine
        public DbSet<Character> Characters { get; set; }
        public DbSet<StoryEnvironment> StoryEnvironments { get; set; }
        public DbSet<Episode> Episodes { get; set; }
        public DbSet<Scene> Scenes { get; set; }
        public DbSet<Show> Shows { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}
