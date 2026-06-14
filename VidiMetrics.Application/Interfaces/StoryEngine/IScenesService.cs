using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Application.DTOs.StoryEngine.Scenes;

namespace VidiMetrics.Application.Interfaces.StoryEngine;

public interface IScenesService
{
    Task<SceneResponseDto> GetByIdAsync(Guid userId, Guid id, CancellationToken ct = default);
    Task<PaginationResponseDto<SceneResponseDto>> GetAllAsync(Guid userId, SceneFilterDto filter, CancellationToken ct = default);
    Task<SceneResponseDto> CreateAsync(Guid userId, CreateSceneDto dto);
    Task<SceneResponseDto> UpdateAsync(Guid userId, Guid id, UpdateSceneDto dto);
    Task<bool> DeleteAsync(Guid userId, Guid id);
}
