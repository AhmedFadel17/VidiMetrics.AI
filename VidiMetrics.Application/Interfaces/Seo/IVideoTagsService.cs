using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Seo.VideoTags;

namespace VidiMetrics.Application.Interfaces.Seo;

public interface IVideoTagsService
{
    Task<VideoTagResponseDto> GetByIdAsync(Guid id);
    Task<IEnumerable<VideoTagResponseDto>> GetAllAsync();
    Task<VideoTagResponseDto> CreateAsync(CreateVideoTagDto dto);
    Task<VideoTagResponseDto> UpdateAsync(Guid id, UpdateVideoTagDto dto);
    Task<bool> DeleteAsync(Guid id);
}
