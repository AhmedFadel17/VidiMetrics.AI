using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using VidiMetrics.API.Factories;
using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Application.DTOs.Infra.UserProfiles;
using VidiMetrics.Application.Interfaces.Infra;

namespace VidiMetrics.API.Controllers.Infra
{
    [Route("api/userprofiles")]
    [ApiController]
    public class UserProfilesController : ControllerBase
    {
        private readonly IUserProfilesService _service;

        public UserProfilesController(IUserProfilesService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<SuccessResponseDto<IEnumerable<UserProfileResponseDto>>>> GetAll()
        {
            var results = await _service.GetAllAsync();
            return Ok(ApiResponseFactory.Success(results, "UserProfiles retrieved successfully."));
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
        public async Task<ActionResult<SuccessResponseDto<UserProfileResponseDto>>> Update(Guid id, [FromBody] UpdateUserProfileDto dto)
        {
            var result = await _service.UpdateAsync(id, dto);
            return Ok(ApiResponseFactory.Success(result, "UserProfile updated successfully."));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponseDto>> Delete(Guid id)
        {
            await _service.DeleteAsync(id);
            return Ok(ApiResponseFactory.Success<object?>(null, "UserProfile deleted successfully."));
        }
    }
}
