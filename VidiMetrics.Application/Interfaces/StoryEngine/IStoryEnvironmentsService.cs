using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Application.DTOs.StoryEngine.StoryEnvironments;

namespace VidiMetrics.Application.Interfaces.StoryEngine;

public interface IStoryEnvironmentsService
{
    Task<StoryEnvironmentResponseDto> GetByIdAsync(Guid id);
    Task<PaginationResponseDto<StoryEnvironmentResponseDto>> GetAllAsync(StoryEnvironmentFilterDto filter);
    Task<StoryEnvironmentResponseDto> CreateAsync(CreateStoryEnvironmentDto dto);
    Task<StoryEnvironmentResponseDto> UpdateAsync(Guid id, UpdateStoryEnvironmentDto dto);
    Task<bool> DeleteAsync(Guid id);
}
