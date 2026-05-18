using System;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Ai.AiVideos;
using VidiMetrics.Application.DTOs.Common;

namespace VidiMetrics.Application.Interfaces.Ai
{
    public interface IAiVideosService
    {
        Task<AiVideoResponseDto> GetByIdAsync(Guid id, Guid userId);
        Task<PaginationResponseDto<AiVideoResponseDto>> GetAllAsync(AiVideoFilterDto filter, Guid userId);
        Task<AiVideoResponseDto> CreateSceneVideoAsync(CreateSceneVideoDto dto, Guid userId);
        Task<AiVideoResponseDto> UpdateAsync(Guid id, UpdateAiVideoDto dto, Guid userId);
        Task<bool> DeleteAsync(Guid id, Guid userId);
    }
}
