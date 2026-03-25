using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.StoryEngine.Shows;

namespace VidiMetrics.Application.Interfaces.StoryEngine;

public interface IShowsService
{
    Task<ShowResponseDto> GetByIdAsync(Guid id);
    Task<IEnumerable<ShowResponseDto>> GetAllAsync();
    Task<ShowResponseDto> CreateAsync(CreateShowDto dto);
    Task<ShowResponseDto> UpdateAsync(Guid id, UpdateShowDto dto);
    Task<bool> DeleteAsync(Guid id);
}
