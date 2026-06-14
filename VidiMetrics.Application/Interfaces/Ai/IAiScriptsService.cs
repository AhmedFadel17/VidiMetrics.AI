using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Ai.AiScripts;
using VidiMetrics.Application.DTOs.Common;

namespace VidiMetrics.Application.Interfaces.Ai;


public interface IAiScriptsService
{
    Task<AiScriptResponseDto> GetByIdAsync(Guid userId, Guid id, CancellationToken ct = default);
    Task<PaginationResponseDto<AiScriptResponseDto>> GetAllAsync(Guid userId, AiScriptFilterDto filter, CancellationToken ct = default);
    Task<AiScriptResponseDto> CreateAsync(Guid userId, CreateAiScriptDto dto);
    Task<AiScriptResponseDto> UpdateAsync(Guid userId, Guid id, UpdateAiScriptDto dto);
    Task<bool> DeleteAsync(Guid userId, Guid id);
}