using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VidiMetrics.API.Factories;
using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Application.DTOs.StoryEngine.Shows;
using VidiMetrics.Application.DTOs.StoryEngine.Stats;
using VidiMetrics.Application.Interfaces.StoryEngine;
using VidiMetrics.Domain.Enums;

namespace VidiMetrics.API.Controllers.StoryEngine;

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
    public async Task<ActionResult<SuccessResponseDto<PaginationResponseDto<ShowResponseDto>>>> GetAllShows(
        [FromQuery] ShowFilterDto filter,
        CancellationToken ct)
    {
        var results = await _service.GetAllAsync(CurrentUserGuid, filter, ct);
        return Ok(ApiResponseFactory.Success(results, "Shows retrieved successfully."));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<SuccessResponseDto<ShowResponseDto>>> GetById(Guid id, CancellationToken ct)
    {
        var result = await _service.GetByIdAsync(CurrentUserGuid, id, ct);
        return Ok(ApiResponseFactory.Success(result, "Show retrieved successfully."));
    }

    [HttpPost]
    public async Task<ActionResult<SuccessResponseDto<ShowResponseDto>>> Create([FromBody] CreateShowDto dto)
    {
        var result = await _service.CreateAsync(CurrentUserGuid, dto);
        return CreatedAtAction(nameof(GetById), new { id = result.Id },
            ApiResponseFactory.Success(result, "Show created successfully.", 201));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<SuccessResponseDto<ShowResponseDto>>> Update(Guid id, [FromBody] UpdateShowDto dto)
    {
        var result = await _service.UpdateAsync(CurrentUserGuid, id, dto);
        return Ok(ApiResponseFactory.Success(result, "Show updated successfully."));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponseDto>> Delete(Guid id)
    {
        await _service.DeleteAsync(CurrentUserGuid, id);
        return Ok(ApiResponseFactory.Success<object?>(null, "Show deleted successfully."));
    }

    [HttpGet("stats")]
    public async Task<ActionResult<SuccessResponseDto<StoryEngineStatsResponseDto>>> GetStats(CancellationToken ct)
    {
        var result = await _service.GetStatsAsync(CurrentUserGuid, ct);
        return Ok(ApiResponseFactory.Success(result, "Stats retrieved successfully."));
    }
}