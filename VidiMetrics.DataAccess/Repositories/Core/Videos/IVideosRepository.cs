using System.Threading.Tasks;
using VidiMetrics.Domain.Models.Core;

namespace VidiMetrics.DataAccess.Repositories.Core.Videos
{
    public interface IVideosRepository : IBaseRepository<Video>
    {
        // Additional Video-specific methods can be added here
        //Task<Video?> GetVideoWithDetailsAsync(System.Guid id);
    }
}
