using VidiMetrics.Application.DTOs.Core.ShowChannels;
using VidiMetrics.Domain.Models.Core;

namespace VidiMetrics.Application.Interfaces.Core;

public interface IShowChannelsService
{
    Task<bool> ConnectShowToChannelAsync(Guid userId, Guid showId, Guid channelId, CancellationToken ct = default);
    Task<bool> DisconnectShowFromChannelAsync(Guid userId, Guid showId, Guid channelId, CancellationToken ct = default);
    Task<List<ShowChannelResponseDto>> GetShowChannelsAsync(Guid userId, Guid showId, CancellationToken ct = default);
    Task<bool> UpdateShowChannelSettingsAsync(Guid userId, Guid showChannelId, UpdateShowChannelSettingsDto dto, CancellationToken ct = default);
}
