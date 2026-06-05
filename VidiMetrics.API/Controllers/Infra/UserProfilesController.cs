using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VidiMetrics.API.Factories;
using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Application.DTOs.Infra.UserProfiles;
using VidiMetrics.Application.Interfaces.Infra;
using VidiMetrics.Domain.Enums;

namespace VidiMetrics.API.Controllers.Infra
{
    [Route("api/user/profiles")]
    [ApiController]
    [Authorize]
    public class UserProfilesController : ApiBaseController
    {
        private readonly IUserProfilesService _service;

        public UserProfilesController(IUserProfilesService service)
        {
            _service = service;
        }

        [HttpGet]
        [Authorize(Roles = nameof(UserRole.Admin))]
        public async Task<ActionResult<SuccessResponseDto<IEnumerable<UserProfileResponseDto>>>> GetAll()
        {
            var results = await _service.GetAllAsync();
            return Ok(ApiResponseFactory.Success(results, "UserProfiles retrieved successfully."));
        }

        [HttpGet("me")]
        public async Task<ActionResult<SuccessResponseDto<UserProfileResponseDto>>> GetUserProfile()
        {
            var result = await _service.GetByIdAsync(CurrentUserGuid);
            return Ok(ApiResponseFactory.Success(result, "UserProfile retrieved successfully."));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SuccessResponseDto<UserProfileResponseDto>>> GetById(Guid id)
        {
            var result = await _service.GetByIdAsync(id);
            return Ok(ApiResponseFactory.Success(result, "UserProfile retrieved successfully."));
        }

        [HttpPost]
        public async Task<ActionResult<SuccessResponseDto<UserProfileResponseDto>>> Create([FromBody] CreateUserProfileDto dto)
        {
            var result = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.UserId }, ApiResponseFactory.Success(result, "UserProfile created successfully.", 201));
        }

        [HttpPut("{id}")]
        [Authorize(Roles = nameof(UserRole.Admin))]
        public async Task<ActionResult<SuccessResponseDto<UserProfileResponseDto>>> Update(Guid id, [FromBody] UpdateUserProfileDto dto)
        {
            var result = await _service.UpdateAsync(id, dto);
            return Ok(ApiResponseFactory.Success(result, "UserProfile updated successfully."));
        }

        [HttpPut("me")]
        public async Task<ActionResult<SuccessResponseDto<UserProfileResponseDto>>> UpdateUserProfile([FromBody] UpdateUserProfileDto dto)
        {
            var result = await _service.UpdateAsync(CurrentUserGuid, dto);
            return Ok(ApiResponseFactory.Success(result, "UserProfile updated successfully."));
        }

        [HttpPut("me/avatar")]
        public async Task<ActionResult<SuccessResponseDto<UserProfileResponseDto>>> UpdateProfileAvatar([FromForm] UploadProfilePictureDto dto)
        {
            var result = await _service.UpdateProfilePictureAsync(CurrentUserGuid, dto);
            return Ok(ApiResponseFactory.Success(result, "User Profile Picture updated successfully."));
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = nameof(UserRole.Admin))]
        public async Task<ActionResult<ApiResponseDto>> Delete(Guid id)
        {
            await _service.DeleteAsync(id);
            return Ok(ApiResponseFactory.Success<object?>(null, "UserProfile deleted successfully."));
        }
    }
}
