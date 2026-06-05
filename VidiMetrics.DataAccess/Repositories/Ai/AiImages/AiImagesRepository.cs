using VidiMetrics.DataAccess.Data;
using VidiMetrics.Domain.Models.Ai;
using VidiMetrics.DataAccess.Providers.Cashing;

namespace VidiMetrics.DataAccess.Repositories.Ai.AiImages;

public class AiImagesRepository : BaseRepository<AiImage>, IAiImagesRepository
{
    public AiImagesRepository(AppDbContext context, ICacheProvider cacheProvider) : base(context,cacheProvider) { }
}
