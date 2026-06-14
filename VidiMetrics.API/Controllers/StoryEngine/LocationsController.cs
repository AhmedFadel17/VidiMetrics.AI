using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VidiMetrics.API.Factories;
using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Application.DTOs.StoryEngine.Locations;
using VidiMetrics.Application.Interfaces.StoryEngine;

namespace VidiMetrics.API.Controllers.StoryEngine;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class LocationsController : ApiBaseController
{
    private readonly ILocationsService _service;

    public LocationsController(ILocationsService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<SuccessResponseDto<PaginationResponseDto<LocationResponseDto>>>> GetAll(
        [FromQuery] LocationFilterDto filter,

        CancellationToken ct)
    {
        var results = await _service.GetAllAsync(CurrentUserGuid, filter, ct);
        return Ok(ApiResponseFactory.Success(results, "Locations retrieved successfully."));
    }

    [HttpGet("lookup")]
    public async Task<ActionResult<SuccessResponseDto<IEnumerable<LookupDto>>>> GetLookup(
        [FromQuery] Guid? showId,

        CancellationToken ct)
    {
        var results = await _service.GetLookupAsync(CurrentUserGuid, showId, ct);
        return Ok(ApiResponseFactory.Success(results, "Location lookup retrieved successfully."));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<SuccessResponseDto<LocationResponseDto>>> GetById(Guid id, CancellationToken ct)
    {
        var result = await _service.GetByIdAsync(CurrentUserGuid, id, ct);
        return Ok(ApiResponseFactory.Success(result, "Location retrieved successfully."));
    }

    [HttpPost]
    public async Task<ActionResult<SuccessResponseDto<LocationResponseDto>>> Create([FromBody] CreateLocationDto dto)
    {
        var result = await _service.CreateAsync(CurrentUserGuid, dto);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, ApiResponseFactory.Success(result, "Location created successfully.", 201));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<SuccessResponseDto<LocationResponseDto>>> Update(Guid id, [FromBody] UpdateLocationDto dto)
    {
        var result = await _service.UpdateAsync(CurrentUserGuid, id, dto);
        return Ok(ApiResponseFactory.Success(result, "Location updated successfully."));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponseDto>> Delete(Guid id)
    {
        await _service.DeleteAsync(CurrentUserGuid, id);
        return Ok(ApiResponseFactory.Success<object?>(null, "Location deleted successfully."));
    }
}