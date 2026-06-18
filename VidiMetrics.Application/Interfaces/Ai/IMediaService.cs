using VidiMetrics.Application.DTOs.Ai.MediaStats;

namespace VidiMetrics.Application.Interfaces.Ai;

public interface IMediaService
{
    Task<MediaStatsResponseDto> GetStatsAsync(Guid userGuid, CancellationToken ct);
}
