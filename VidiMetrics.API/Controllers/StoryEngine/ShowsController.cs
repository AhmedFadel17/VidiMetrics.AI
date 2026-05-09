using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VidiMetrics.API.Factories;
using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Application.DTOs.StoryEngine.Shows;
using VidiMetrics.Application.Interfaces.StoryEngine;
using VidiMetrics.Domain.Enums;

namespace VidiMetrics.API.Controllers.StoryEngine
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

    public class ShowsController : ApiBaseController
    {
        private readonly IShowsService _service;

        public ShowsController(IShowsService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<SuccessResponseDto<PaginationResponseDto<ShowResponseDto>>>> GetAllShows([FromQuery] ShowFilterDto filter)
        {
            var results = await _service.GetAllAsync(CurrentUserGuid, filter, IsAdmin);
            return Ok(ApiResponseFactory.Success(results, "Shows retrieved successfully."));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SuccessResponseDto<ShowResponseDto>>> GetById(Guid id)
        {
            var result = await _service.GetWithDetailsByIdAsync(id, CurrentUserGuid, IsAdmin);
            return Ok(ApiResponseFactory.Success(result, "Show retrieved successfully."));
        }

        [HttpPost]
        public async Task<ActionResult<SuccessResponseDto<ShowResponseDto>>> Create([FromBody] CreateShowDto dto)
        {
            var result = await _service.CreateAsync(dto, CurrentUserGuid);
            return CreatedAtAction(nameof(GetById), new { id = result.Id },
                ApiResponseFactory.Success(result, "Show created successfully.", 201));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<SuccessResponseDto<ShowResponseDto>>> Update(Guid id, [FromBody] UpdateShowDto dto)
        {
            var result = await _service.UpdateAsync(id, dto, CurrentUserGuid, IsAdmin);
            return Ok(ApiResponseFactory.Success(result, "Show updated successfully."));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponseDto>> Delete(Guid id)
        {
            await _service.DeleteAsync(id, CurrentUserGuid, IsAdmin);
            return Ok(ApiResponseFactory.Success<object?>(null, "Show deleted successfully."));
        }
    }
}
