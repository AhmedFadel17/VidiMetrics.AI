using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Infra.UserAccounts;

namespace VidiMetrics.Application.Interfaces.Infra;

public interface IUserAccountsService
{
    Task<UserAccountResponseDto> GetByIdAsync(Guid id);
    Task<IEnumerable<UserAccountResponseDto>> GetAllAsync();
    Task<UserAccountResponseDto> CreateAsync(CreateUserAccountDto dto);
    Task<UserAccountResponseDto> UpdateAsync(Guid id, UpdateUserAccountDto dto);
    Task<bool> DeleteAsync(Guid id);
}
