using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Core.Channels;

namespace VidiMetrics.Application.Interfaces.Core;

public interface IChannelsService
{
    Task<ChannelResponseDto> GetByIdAsync(Guid id);
    Task<IEnumerable<ChannelResponseDto>> GetAllAsync();
    Task<ChannelResponseDto> CreateAsync(CreateChannelDto dto);
    Task<ChannelResponseDto> UpdateAsync(Guid id, UpdateChannelDto dto);
    Task<bool> DeleteAsync(Guid id);
}
