using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Seo.Keywords;

namespace VidiMetrics.Application.Interfaces.Seo;

public interface IKeywordsService
{
    Task<KeywordResponseDto> GetByIdAsync(Guid id);
    Task<IEnumerable<KeywordResponseDto>> GetAllAsync();
    Task<KeywordResponseDto> CreateAsync(CreateKeywordDto dto);
    Task<KeywordResponseDto> UpdateAsync(Guid id, UpdateKeywordDto dto);
    Task<bool> DeleteAsync(Guid id);
}
