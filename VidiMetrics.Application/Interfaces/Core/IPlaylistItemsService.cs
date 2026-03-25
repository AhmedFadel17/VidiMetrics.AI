using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Core.PlaylistItems;

namespace VidiMetrics.Application.Interfaces.Core;

public interface IPlaylistItemsService
{
    Task<PlaylistItemResponseDto> GetByIdAsync(Guid id);
    Task<IEnumerable<PlaylistItemResponseDto>> GetAllAsync();
    Task<PlaylistItemResponseDto> CreateAsync(CreatePlaylistItemDto dto);
    Task<PlaylistItemResponseDto> UpdateAsync(Guid id, UpdatePlaylistItemDto dto);
    Task<bool> DeleteAsync(Guid id);
}
