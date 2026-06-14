using VidiMetrics.Application.DTOs.Ai.AiImages;
using VidiMetrics.Application.DTOs.Common;

namespace VidiMetrics.Application.Interfaces.Ai;

public interface IAiImagesService
{
    Task<AiImageResponseDto> GetByIdAsync(Guid userId, Guid id, CancellationToken ct = default);
    Task<PaginationResponseDto<AiImageResponseDto>> GetAllAsync(Guid userId, AiImageFilterDto filter, CancellationToken ct = default);
    Task<AiImageResponseDto> CreateCharacterImageAsync(Guid userId, CreateCharacterImageDto dto);
    Task<AiImageResponseDto> CreateLocationImageAsync(Guid userId, CreateLocationImageDto dto);
    Task<AiImageResponseDto> CreateShowImageAsync(Guid userId, CreateShowImageDto dto);
    Task<AiImageResponseDto> UpdateAsync(Guid userId, Guid id, UpdateAiImageDto dto);
    Task<bool> DeleteAsync(Guid userId, Guid id);
}
