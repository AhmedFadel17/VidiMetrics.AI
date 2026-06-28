using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Application.DTOs.StoryEngine.Episodes;

namespace VidiMetrics.Application.Interfaces.StoryEngine;

public interface IEpisodesService
{
    Task<EpisodeResponseDto> GetByIdAsync(Guid userId, Guid id, CancellationToken ct = default);
    Task<PaginationResponseDto<EpisodeResponseDto>> GetAllAsync(Guid userId, EpisodeFilterDto filter, CancellationToken ct = default);
    Task<EpisodeResponseDto> CreateAsync(Guid userId, CreateEpisodeDto dto);
    Task<EpisodeResponseDto> UpdateAsync(Guid userId, Guid id, UpdateEpisodeDto dto);
    Task<bool> DeleteAsync(Guid userId, Guid id);
    Task<EpisodeResponseDto> GenerateEpisodeVideoAsync(Guid userId, Guid episodeId);
    Task<bool> ReorderScenesAsync(Guid userId, Guid episodeId, List<Guid> sceneIds);
}
