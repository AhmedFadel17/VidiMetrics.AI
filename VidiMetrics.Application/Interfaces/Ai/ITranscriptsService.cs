using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Ai.Transcripts;

namespace VidiMetrics.Application.Interfaces.Ai;

public interface ITranscriptsService
{
    Task<TranscriptResponseDto> GetByIdAsync(Guid id);
    Task<IEnumerable<TranscriptResponseDto>> GetAllAsync();
    Task<TranscriptResponseDto> CreateAsync(CreateTranscriptDto dto);
    Task<TranscriptResponseDto> UpdateAsync(Guid id, UpdateTranscriptDto dto);
    Task<bool> DeleteAsync(Guid id);
}
