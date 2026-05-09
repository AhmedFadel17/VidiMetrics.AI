using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Application.DTOs.StoryEngine.Scenes;

namespace VidiMetrics.Application.Interfaces.StoryEngine;

public interface IScenesService
{
    Task<SceneResponseDto> GetByIdAsync(Guid id);
    Task<PaginationResponseDto<SceneResponseDto>> GetAllAsync(SceneFilterDto filter);
    Task<SceneResponseDto> CreateAsync(CreateSceneDto dto);
    Task<SceneResponseDto> UpdateAsync(Guid id, UpdateSceneDto dto);
    Task<bool> DeleteAsync(Guid id);
}
