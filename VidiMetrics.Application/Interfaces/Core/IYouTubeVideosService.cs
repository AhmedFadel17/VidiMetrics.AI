using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Core.YouTubeVideos;

namespace VidiMetrics.Application.Interfaces.Core;

public interface IYouTubeVideosService
{
    Task<YouTubeVideoResponseDto> GetByIdAsync(Guid id);
    Task<IEnumerable<YouTubeVideoResponseDto>> GetAllAsync();
    Task<YouTubeVideoResponseDto> CreateAsync(CreateYouTubeVideoDto dto);
    Task<YouTubeVideoResponseDto> UpdateAsync(Guid id, UpdateYouTubeVideoDto dto);
    Task<bool> DeleteAsync(Guid id);
}
