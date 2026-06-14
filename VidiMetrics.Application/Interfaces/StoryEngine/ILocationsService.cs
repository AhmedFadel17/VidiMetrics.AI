using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Application.DTOs.StoryEngine.Locations;

namespace VidiMetrics.Application.Interfaces.StoryEngine;

public interface ILocationsService
{
    Task<LocationResponseDto> GetByIdAsync(Guid userId, Guid id, CancellationToken ct = default);
    Task<PaginationResponseDto<LocationResponseDto>> GetAllAsync(Guid userId, LocationFilterDto filter, CancellationToken ct = default);
    Task<IEnumerable<LookupDto>> GetLookupAsync(Guid userId, Guid? showId = null, CancellationToken ct = default);
    Task<LocationResponseDto> CreateAsync(Guid userId, CreateLocationDto dto);
    Task<LocationResponseDto> UpdateAsync(Guid userId, Guid id, UpdateLocationDto dto);
    Task<bool> DeleteAsync(Guid userId, Guid id);
}
