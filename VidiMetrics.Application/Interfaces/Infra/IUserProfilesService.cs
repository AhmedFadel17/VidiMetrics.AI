using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Infra.UserProfiles;

namespace VidiMetrics.Application.Interfaces.Infra;

public interface IUserProfilesService
{
    Task<UserProfileResponseDto> GetByIdAsync(Guid userId);
    Task<IEnumerable<UserProfileResponseDto>> GetAllAsync();
    Task<UserProfileResponseDto> CreateAsync(CreateUserProfileDto dto);
    Task<UserProfileResponseDto> UpdateAsync(Guid userId, UpdateUserProfileDto dto);
    Task<UserProfileResponseDto> UpdateProfilePictureAsync(Guid userId, UploadProfilePictureDto dto);
    Task<bool> DeleteAsync(Guid userId);
}
