using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Core.Playlists;

namespace VidiMetrics.Application.Interfaces.Core;

public interface IPlaylistsService
{
    Task<PlaylistResponseDto> GetByIdAsync(Guid id);
    Task<IEnumerable<PlaylistResponseDto>> GetAllAsync();
    Task<PlaylistResponseDto> CreateAsync(CreatePlaylistDto dto);
    Task<PlaylistResponseDto> UpdateAsync(Guid id, UpdatePlaylistDto dto);
    Task<bool> DeleteAsync(Guid id);
}
