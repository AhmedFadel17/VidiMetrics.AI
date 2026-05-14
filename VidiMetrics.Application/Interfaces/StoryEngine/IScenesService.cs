using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Application.DTOs.StoryEngine.Scenes;

namespace VidiMetrics.Application.Interfaces.StoryEngine;

public interface IScenesService
{
    Task<SceneResponseDto> GetByIdAsync(Guid id, Guid userId);
    Task<PaginationResponseDto<SceneResponseDto>> GetAllAsync(SceneFilterDto filter, Guid userId);
    Task<SceneResponseDto> CreateAsync(CreateSceneDto dto, Guid userId);
    Task<SceneResponseDto> UpdateAsync(Guid id, UpdateSceneDto dto, Guid userId);
    Task<bool> DeleteAsync(Guid id, Guid userId);
}
