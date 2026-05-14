using VidiMetrics.DataAccess.Data;
using VidiMetrics.Domain.Models.Ai;

namespace VidiMetrics.DataAccess.Repositories.Ai.AiImages;

public class AiImagesRepository : BaseRepository<AiImage>, IAiImagesRepository
{
    public AiImagesRepository(AppDbContext context) : base(context) { }
}
