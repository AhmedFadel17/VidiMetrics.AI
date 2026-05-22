using Microsoft.EntityFrameworkCore;
using VidiMetrics.Domain.Models.Ai;
using VidiMetrics.Domain.Models.Core;
using VidiMetrics.Domain.Models.Infra;
using VidiMetrics.Domain.Models.Seo;
using VidiMetrics.Domain.Models.StoryEngine;

namespace VidiMetrics.DataAccess.Data
{
    public class AppDbContext : DbContext
    {
        // Core
        public DbSet<Channel> Channels { get; set; }
        public DbSet<ChannelPost> ChannelPosts { get; set; }
        public DbSet<ChannelStat> ChannelStats { get; set; }
        public DbSet<Video> Videos { get; set; }

        // Ai
        public DbSet<AiPromptTemplate> AiPromptTemplates { get; set; }
        public DbSet<AiTask> AiTasks { get; set; }
        public DbSet<AiImage> AiImages { get; set; }
        public DbSet<AiScript> AiScripts { get; set; }
        public DbSet<AiVideo> AiVideos { get; set; }
        public DbSet<Transcript> Transcripts { get; set; }

        // Infra
        public DbSet<ApiUsageQuota> ApiUsageQuotas { get; set; }
        public DbSet<SubscriptionPlan> SubscriptionPlans { get; set; }
        public DbSet<UserProfile> UserProfiles { get; set; }
        public DbSet<UserSubscription> UserSubscriptions { get; set; }

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
        public DbSet<SceneCharacter> SceneCharacters { get; set; }

        private readonly Microsoft.Extensions.Configuration.IConfiguration _configuration;
        public AppDbContext(DbContextOptions<AppDbContext> options, Microsoft.Extensions.Configuration.IConfiguration configuration) : base(options)
        {
            _configuration = configuration;
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Channel>()
                        .HasOne(c => c.ChannelStat)
                        .WithOne(s => s.Channel)
                        .HasForeignKey<ChannelStat>(s => s.ChannelId)
                        .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ChannelPost>()
                .HasOne(p => p.Channel)
                .WithMany(c => c.ChannelPosts)
                .HasForeignKey(p => p.ChannelId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Episode>()
                .HasOne(e => e.AiVideo)
                .WithMany()
                .HasForeignKey(e => e.AiVideoId)
                .OnDelete(DeleteBehavior.Restrict);


            modelBuilder.Entity<Character>()
                .HasOne(c => c.Show)
                .WithMany(s => s.Characters)
                .HasForeignKey(c => c.ShowId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<SceneCharacter>()
                .HasKey(sc => new { sc.SceneId, sc.CharacterId });

            modelBuilder.Entity<SceneCharacter>()
                .HasOne(sc => sc.Scene)
                .WithMany(s => s.SceneCharacters)
                .HasForeignKey(sc => sc.SceneId);

            modelBuilder.Entity<SceneCharacter>()
                .HasOne(sc => sc.Character)
                .WithMany(c => c.SceneCharacters)
                .HasForeignKey(sc => sc.CharacterId);

            modelBuilder.Entity<Scene>()
                .HasOne(s => s.AiScript)
                .WithOne()
                .HasForeignKey<Scene>(s => s.AiScriptId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Scene>()
                .HasOne(s => s.AiVideo)
                .WithOne()
                .HasForeignKey<Scene>(s => s.AiVideoId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<AiScript>()
                .HasOne(a => a.StoryEnvironment)
                .WithMany()
                .HasForeignKey(a => a.StoryEnvironmentId)
                .OnDelete(DeleteBehavior.Restrict);

            // UserProfile Configuration
            modelBuilder.Entity<UserProfile>(entity =>
            {
                entity.HasKey(e => e.UserId);
                entity.Property(e => e.FullName).HasMaxLength(150).IsRequired();
                entity.Property(e => e.ProfilePictureUrl).HasMaxLength(500);
                entity.Property(e => e.Bio).HasMaxLength(1000);
            });

            // SubscriptionPlan Configuration
            modelBuilder.Entity<SubscriptionPlan>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).HasMaxLength(100).IsRequired();
                entity.Property(e => e.Description).HasMaxLength(500);
                entity.Property(e => e.MonthlyPrice).HasPrecision(18, 2);
            });

            // Seeding logic moved to a dedicated folder
            VidiMetrics.DataAccess.Seeds.SubscriptionPlanSeeds.SeedSubscriptionPlans(modelBuilder, _configuration);

            // UserSubscription Configuration
            modelBuilder.Entity<UserSubscription>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.HasOne(e => e.UserProfile)
                      .WithMany(p => p.SubscriptionHistory)
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.SubscriptionPlan)
                      .WithMany(p => p.UserSubscriptions)
                      .HasForeignKey(e => e.PlanId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.Property(e => e.Status)
                      .HasConversion<string>()
                      .HasMaxLength(20);
            });




        }
    }
}
