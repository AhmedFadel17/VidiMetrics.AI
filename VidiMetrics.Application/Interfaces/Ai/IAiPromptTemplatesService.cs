using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Ai.AiPromptTemplates;

namespace VidiMetrics.Application.Interfaces.Ai;

public interface IAiPromptTemplatesService
{
    Task<AiPromptTemplateResponseDto> GetByIdAsync(Guid id);
    Task<IEnumerable<AiPromptTemplateResponseDto>> GetAllAsync();
    Task<AiPromptTemplateResponseDto> CreateAsync(CreateAiPromptTemplateDto dto);
    Task<AiPromptTemplateResponseDto> UpdateAsync(Guid id, UpdateAiPromptTemplateDto dto);
    Task<bool> DeleteAsync(Guid id);
}
