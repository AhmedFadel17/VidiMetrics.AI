using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Infra.ApiUsageQuotas;

namespace VidiMetrics.Application.Interfaces.Infra;

public interface IApiUsageQuotasService
{
    Task<ApiUsageQuotaResponseDto> GetByIdAsync(Guid id);
    Task<IEnumerable<ApiUsageQuotaResponseDto>> GetAllAsync();
    Task<ApiUsageQuotaResponseDto> CreateAsync(CreateApiUsageQuotaDto dto);
    Task<ApiUsageQuotaResponseDto> UpdateAsync(Guid id, UpdateApiUsageQuotaDto dto);
    Task<bool> DeleteAsync(Guid id);
}
