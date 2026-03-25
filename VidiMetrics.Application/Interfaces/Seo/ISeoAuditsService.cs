using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Seo.SeoAudits;

namespace VidiMetrics.Application.Interfaces.Seo;

public interface ISeoAuditsService
{
    Task<SeoAuditResponseDto> GetByIdAsync(Guid id);
    Task<IEnumerable<SeoAuditResponseDto>> GetAllAsync();
    Task<SeoAuditResponseDto> CreateAsync(CreateSeoAuditDto dto);
    Task<SeoAuditResponseDto> UpdateAsync(Guid id, UpdateSeoAuditDto dto);
    Task<bool> DeleteAsync(Guid id);
}
