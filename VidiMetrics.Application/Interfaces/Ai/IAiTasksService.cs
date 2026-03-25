using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Ai.AiTasks;

namespace VidiMetrics.Application.Interfaces.Ai;

public interface IAiTasksService
{
    Task<AiTaskResponseDto> GetByIdAsync(Guid id);
    Task<IEnumerable<AiTaskResponseDto>> GetAllAsync();
    Task<AiTaskResponseDto> CreateAsync(CreateAiTaskDto dto);
    Task<AiTaskResponseDto> UpdateAsync(Guid id, UpdateAiTaskDto dto);
    Task<bool> DeleteAsync(Guid id);
}
