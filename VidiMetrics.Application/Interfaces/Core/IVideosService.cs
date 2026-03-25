using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Core.Videos;

namespace VidiMetrics.Application.Interfaces.Core;

public interface IVideosService
{
    Task<VideoResponseDto> GetByIdAsync(Guid id);
    Task<IEnumerable<VideoResponseDto>> GetAllAsync();
    Task<VideoResponseDto> CreateAsync(CreateVideoDto dto);
    Task<VideoResponseDto> UpdateAsync(Guid id, UpdateVideoDto dto);
    Task<bool> DeleteAsync(Guid id);
}
