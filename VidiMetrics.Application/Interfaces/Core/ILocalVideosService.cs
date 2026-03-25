using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Core.LocalVideos;

namespace VidiMetrics.Application.Interfaces.Core;

public interface ILocalVideosService
{
    Task<LocalVideoResponseDto> GetByIdAsync(Guid id);
    Task<IEnumerable<LocalVideoResponseDto>> GetAllAsync();
    Task<LocalVideoResponseDto> CreateAsync(CreateLocalVideoDto dto);
    Task<LocalVideoResponseDto> UpdateAsync(Guid id, UpdateLocalVideoDto dto);
    Task<bool> DeleteAsync(Guid id);
}
