using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Application.DTOs.StoryEngine.Shows;
using VidiMetrics.Application.DTOs.StoryEngine.Stats;

namespace VidiMetrics.Application.Interfaces.StoryEngine;

public interface IShowsService
{
    Task<ShowResponseDto> GetByIdAsync(Guid userId, Guid id, CancellationToken ct = default);
    Task<ShowResponseDto> GetWithDetailsByIdAsync(Guid userId, Guid id, CancellationToken ct = default);
    Task<PaginationResponseDto<ShowResponseDto>> GetAllAsync(Guid userId, ShowFilterDto filter, CancellationToken ct = default);
    Task<ShowResponseDto> CreateAsync(Guid userId, CreateShowDto dto);
    Task<ShowResponseDto> UpdateAsync(Guid userId, Guid id, UpdateShowDto dto);
    Task<bool> DeleteAsync(Guid userId, Guid id);
    Task<StoryEngineStatsResponseDto> GetStatsAsync(Guid userId, CancellationToken ct = default);

}
