using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Ai.ShortsProjects;

namespace VidiMetrics.Application.Interfaces.Ai;

public interface IShortsProjectsService
{
    Task<ShortsProjectResponseDto> GetByIdAsync(Guid id);
    Task<IEnumerable<ShortsProjectResponseDto>> GetAllAsync();
    Task<ShortsProjectResponseDto> CreateAsync(CreateShortsProjectDto dto);
    Task<ShortsProjectResponseDto> UpdateAsync(Guid id, UpdateShortsProjectDto dto);
    Task<bool> DeleteAsync(Guid id);
}
