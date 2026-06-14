using System;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Ai.AiVideos;
using VidiMetrics.Application.DTOs.Common;

namespace VidiMetrics.Application.Interfaces.Ai;

public interface IAiVideosService
{
    Task<AiVideoResponseDto> GetByIdAsync(Guid userId, Guid id, CancellationToken ct = default);
    Task<PaginationResponseDto<AiVideoResponseDto>> GetAllAsync(Guid userId, AiVideoFilterDto filter, CancellationToken ct = default);
    Task<AiVideoResponseDto> CreateSceneVideoAsync(Guid userId, CreateSceneVideoDto dto);
    Task<AiVideoResponseDto> UpdateAsync(Guid userId, Guid id, UpdateAiVideoDto dto);
    Task<bool> DeleteAsync(Guid userId, Guid id);
}
