using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.StoryEngine.Shows;

namespace VidiMetrics.Application.Interfaces.StoryEngine;

public interface IShowsService
{
    Task<ShowResponseDto> GetByIdAsync(Guid id, Guid userId, bool isAdmin);
    Task<IEnumerable<ShowResponseDto>> GetAllAsync(Guid userId, bool isAdmin);
    Task<ShowResponseDto> CreateAsync(CreateShowDto dto, Guid userId);
    Task<ShowResponseDto> UpdateAsync(Guid id, UpdateShowDto dto, Guid userId, bool isAdmin);
    Task<bool> DeleteAsync(Guid id, Guid userId, bool isAdmin);
}
