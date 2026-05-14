using VidiMetrics.Application.DTOs.Ai.AiImages;
using VidiMetrics.Application.DTOs.Common;

namespace VidiMetrics.Application.Interfaces.Ai;

public interface IAiImagesService
{
    Task<AiImageResponseDto> GetByIdAsync(Guid id, Guid userId);
    Task<PaginationResponseDto<AiImageResponseDto>> GetAllAsync(AiImageFilterDto filter, Guid userId);
    Task<AiImageResponseDto> CreateCharacterImageAsync(CreateCharacterImageDto dto, Guid userId);
    Task<AiImageResponseDto> CreateEnvironmentImageAsync(CreateEnvironmentImageDto dto, Guid userId);
    Task<AiImageResponseDto> UpdateAsync(Guid id, UpdateAiImageDto dto, Guid userId);
    Task<bool> DeleteAsync(Guid id, Guid userId);
}
