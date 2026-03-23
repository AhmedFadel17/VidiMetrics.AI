using Microsoft.EntityFrameworkCore;
using VidiMetrics.Domain.Models.Core;

namespace VidiMetrics.DataAccess.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<Video> Videos { get; set; }
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

        }
    }
}