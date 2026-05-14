using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Application.DTOs.StoryEngine.StoryEnvironments;

namespace VidiMetrics.Application.Interfaces.StoryEngine;

public interface IStoryEnvironmentsService
{
    Task<StoryEnvironmentResponseDto> GetByIdAsync(Guid id, Guid userId);
    Task<PaginationResponseDto<StoryEnvironmentResponseDto>> GetAllAsync(StoryEnvironmentFilterDto filter, Guid userId);
    Task<IEnumerable<LookupDto>> GetLookupAsync(Guid userId, Guid? showId = null);
    Task<StoryEnvironmentResponseDto> CreateAsync(CreateStoryEnvironmentDto dto, Guid userId);
    Task<StoryEnvironmentResponseDto> UpdateAsync(Guid id, UpdateStoryEnvironmentDto dto, Guid userId);
    Task<bool> DeleteAsync(Guid id, Guid userId);
}
