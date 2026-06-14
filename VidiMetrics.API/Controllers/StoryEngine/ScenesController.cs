using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VidiMetrics.API.Factories;
using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Application.DTOs.StoryEngine.Scenes;
using VidiMetrics.Application.Interfaces.StoryEngine;

namespace VidiMetrics.API.Controllers.StoryEngine;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class ScenesController : ApiBaseController
{
    private readonly IScenesService _service;

    public ScenesController(IScenesService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<SuccessResponseDto<PaginationResponseDto<SceneResponseDto>>>> GetAll(
        [FromQuery] SceneFilterDto filter,

        CancellationToken ct)
    {
        var results = await _service.GetAllAsync(CurrentUserGuid, filter, ct);
        return Ok(ApiResponseFactory.Success(results, "Scenes retrieved successfully."));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<SuccessResponseDto<SceneResponseDto>>> GetById(Guid id, CancellationToken ct)
    {
        var result = await _service.GetByIdAsync(CurrentUserGuid, id, ct);
        return Ok(ApiResponseFactory.Success(result, "Scene retrieved successfully."));
    }

    [HttpPost]
    public async Task<ActionResult<SuccessResponseDto<SceneResponseDto>>> Create([FromBody] CreateSceneDto dto)
    {
        var result = await _service.CreateAsync(CurrentUserGuid, dto);
        return CreatedAtAction(nameof(GetById), new { id = result.Id },

            ApiResponseFactory.Success(result, "Scene created successfully.", 201));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<SuccessResponseDto<SceneResponseDto>>> Update(Guid id, [FromBody] UpdateSceneDto dto)
    {
        var result = await _service.UpdateAsync(CurrentUserGuid, id, dto);
        return Ok(ApiResponseFactory.Success(result, "Scene updated successfully."));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponseDto>> Delete(Guid id)
    {
        await _service.DeleteAsync(CurrentUserGuid, id);
        return Ok(ApiResponseFactory.Success<object?>(null, "Scene deleted successfully."));
    }
}