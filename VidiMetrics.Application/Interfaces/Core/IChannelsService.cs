using System;
using System.Collections.Generic;
using System.Threading.Channels;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Core.Channels;
using VidiMetrics.Domain.Enums;

namespace VidiMetrics.Application.Interfaces.Core;

public interface IChannelsService
{
    Task<ChannelResponseDto> GetByIdAsync(Guid id, Guid userId);
    Task<IEnumerable<ChannelResponseDto>> GetAllAsync();

    Task<IEnumerable<ChannelResponseDto>> GetByUserIdAsync(Guid userId);
    Task<ChannelResponseDto> CreateAsync(CreateChannelDto dto, Guid userId);
    Task<ChannelResponseDto> UpdateAsync(Guid id, UpdateChannelDto dto, Guid userId);
    Task<bool> DeleteAsync(Guid id, Guid userId);

    Task<ChannelResponseDto> ConnectChannelAsync(TargetPlatform platform, Guid userId, string authorizationCode, string redirectUri);
    Task SyncChannelMetricsAsync(TargetPlatform platform, Guid channelId, Guid userId);
}
