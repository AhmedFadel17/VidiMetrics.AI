using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VidiMetrics.API.Factories;
using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Application.DTOs.StoryEngine.StoryEnvironments;
using VidiMetrics.Application.Interfaces.StoryEngine;

namespace VidiMetrics.API.Controllers.StoryEngine
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class StoryEnvironmentsController : ApiBaseController
    {
        private readonly IStoryEnvironmentsService _service;

        public StoryEnvironmentsController(IStoryEnvironmentsService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<SuccessResponseDto<PaginationResponseDto<StoryEnvironmentResponseDto>>>> GetAll([FromQuery] StoryEnvironmentFilterDto filter)
        {
            var results = await _service.GetAllAsync(filter, CurrentUserGuid);
            return Ok(ApiResponseFactory.Success(results, "StoryEnvironments retrieved successfully."));
        }

        [HttpGet("lookup")]
        public async Task<ActionResult<SuccessResponseDto<IEnumerable<LookupDto>>>> GetLookup([FromQuery] Guid? showId)
        {
            var results = await _service.GetLookupAsync(CurrentUserGuid, showId);
            return Ok(ApiResponseFactory.Success(results, "StoryEnvironment lookup retrieved successfully."));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SuccessResponseDto<StoryEnvironmentResponseDto>>> GetById(Guid id)
        {
            var result = await _service.GetByIdAsync(id, CurrentUserGuid);
            return Ok(ApiResponseFactory.Success(result, "StoryEnvironment retrieved successfully."));
        }

        [HttpPost]
        public async Task<ActionResult<SuccessResponseDto<StoryEnvironmentResponseDto>>> Create([FromBody] CreateStoryEnvironmentDto dto)
        {
            var result = await _service.CreateAsync(dto, CurrentUserGuid);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, ApiResponseFactory.Success(result, "StoryEnvironment created successfully.", 201));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<SuccessResponseDto<StoryEnvironmentResponseDto>>> Update(Guid id, [FromBody] UpdateStoryEnvironmentDto dto)
        {
            var result = await _service.UpdateAsync(id, dto, CurrentUserGuid);
            return Ok(ApiResponseFactory.Success(result, "StoryEnvironment updated successfully."));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponseDto>> Delete(Guid id)
        {
            await _service.DeleteAsync(id, CurrentUserGuid);
            return Ok(ApiResponseFactory.Success<object?>(null, "StoryEnvironment deleted successfully."));
        }
    }
}
