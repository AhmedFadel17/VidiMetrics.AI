using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Infra.UserProfiles;

namespace VidiMetrics.Application.Interfaces.Infra;

public interface IUserProfilesService
{
    Task<UserProfileResponseDto> GetByIdAsync(Guid id);
    Task<IEnumerable<UserProfileResponseDto>> GetAllAsync();
    Task<UserProfileResponseDto> CreateAsync(CreateUserProfileDto dto);
    Task<UserProfileResponseDto> UpdateAsync(Guid id, UpdateUserProfileDto dto);
    Task<bool> DeleteAsync(Guid id);
}
