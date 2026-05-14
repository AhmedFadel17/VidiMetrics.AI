using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Application.DTOs.StoryEngine.Episodes;

namespace VidiMetrics.Application.Interfaces.StoryEngine;

public interface IEpisodesService
{
    Task<EpisodeResponseDto> GetByIdAsync(Guid id, Guid userId);
    Task<PaginationResponseDto<EpisodeResponseDto>> GetAllAsync(EpisodeFilterDto filter, Guid userId);
    Task<EpisodeResponseDto> CreateAsync(CreateEpisodeDto dto, Guid userId);
    Task<EpisodeResponseDto> UpdateAsync(Guid id, UpdateEpisodeDto dto, Guid userId);
    Task<bool> DeleteAsync(Guid id, Guid userId);
}
