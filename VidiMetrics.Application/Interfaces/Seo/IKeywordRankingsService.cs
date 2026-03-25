using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Seo.KeywordRankings;

namespace VidiMetrics.Application.Interfaces.Seo;

public interface IKeywordRankingsService
{
    Task<KeywordRankingResponseDto> GetByIdAsync(Guid id);
    Task<IEnumerable<KeywordRankingResponseDto>> GetAllAsync();
    Task<KeywordRankingResponseDto> CreateAsync(CreateKeywordRankingDto dto);
    Task<KeywordRankingResponseDto> UpdateAsync(Guid id, UpdateKeywordRankingDto dto);
    Task<bool> DeleteAsync(Guid id);
}
