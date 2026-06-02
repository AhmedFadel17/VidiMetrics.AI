using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Ai.AiScripts;
using VidiMetrics.Application.DTOs.Common;

namespace VidiMetrics.Application.Interfaces.Ai
{
    public interface IAiScriptsService
    {
        Task<AiScriptResponseDto> GetByIdAsync(Guid id, Guid userId);
        Task<PaginationResponseDto<AiScriptResponseDto>> GetAllAsync(AiScriptFilterDto filter, Guid userId);
        Task<AiScriptResponseDto> CreateAsync(CreateAiScriptDto dto, Guid userId);
        Task<AiScriptResponseDto> UpdateAsync(Guid id, UpdateAiScriptDto dto, Guid userId);
        Task<bool> DeleteAsync(Guid id, Guid userId);
    }
}
