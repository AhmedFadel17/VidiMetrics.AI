using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Application.DTOs.StoryEngine.Shows;

namespace VidiMetrics.Application.Interfaces.StoryEngine;

public interface IShowsService
{
    Task<ShowResponseDto> GetByIdAsync(Guid id, Guid userId, bool isAdmin = false);
    Task<ShowResponseDto> GetWithDetailsByIdAsync(Guid id, Guid userId, bool isAdmin = false);
    Task<PaginationResponseDto<ShowResponseDto>> GetAllAsync(Guid userId, ShowFilterDto filter, bool isAdmin = false);
    Task<ShowResponseDto> CreateAsync(CreateShowDto dto, Guid userId, bool isAdmin = false);
    Task<ShowResponseDto> UpdateAsync(Guid id, UpdateShowDto dto, Guid userId, bool isAdmin = false);
    Task<bool> DeleteAsync(Guid id, Guid userId, bool isAdmin = false);
}
