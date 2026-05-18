using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Ai.AiScripts;

namespace VidiMetrics.Application.Interfaces.Ai
{
    public interface IAiScriptsService
    {
        Task<AiScriptResponseDto> GetByIdAsync(Guid id, Guid userId);
        Task<IEnumerable<AiScriptResponseDto>> GetAllAsync(Guid userId);
        Task<AiScriptResponseDto> CreateAsync(CreateAiScriptDto dto, Guid userId);
        Task<AiScriptResponseDto> UpdateAsync(Guid id, UpdateAiScriptDto dto, Guid userId);
        Task<bool> DeleteAsync(Guid id, Guid userId);
    }
}
