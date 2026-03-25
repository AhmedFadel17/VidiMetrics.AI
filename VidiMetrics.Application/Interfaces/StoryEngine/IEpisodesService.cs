using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.StoryEngine.Episodes;

namespace VidiMetrics.Application.Interfaces.StoryEngine;

public interface IEpisodesService
{
    Task<EpisodeResponseDto> GetByIdAsync(Guid id);
    Task<IEnumerable<EpisodeResponseDto>> GetAllAsync();
    Task<EpisodeResponseDto> CreateAsync(CreateEpisodeDto dto);
    Task<EpisodeResponseDto> UpdateAsync(Guid id, UpdateEpisodeDto dto);
    Task<bool> DeleteAsync(Guid id);
}
