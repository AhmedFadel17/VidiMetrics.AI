using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Seo.CompetitorVideos;

namespace VidiMetrics.Application.Interfaces.Seo;

public interface ICompetitorVideosService
{
    Task<CompetitorVideoResponseDto> GetByIdAsync(Guid id);
    Task<IEnumerable<CompetitorVideoResponseDto>> GetAllAsync();
    Task<CompetitorVideoResponseDto> CreateAsync(CreateCompetitorVideoDto dto);
    Task<CompetitorVideoResponseDto> UpdateAsync(Guid id, UpdateCompetitorVideoDto dto);
    Task<bool> DeleteAsync(Guid id);
}
