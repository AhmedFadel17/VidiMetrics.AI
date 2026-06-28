using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VidiMetrics.API.Factories;
using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Application.DTOs.StoryEngine.Episodes;
using VidiMetrics.Application.Interfaces.StoryEngine;
using VidiMetrics.Application.DTOs.StoryEngine.Scenes;

namespace VidiMetrics.API.Controllers.StoryEngine;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class EpisodesController : ApiBaseController
{
    private readonly IEpisodesService _service;

    public EpisodesController(IEpisodesService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<SuccessResponseDto<PaginationResponseDto<EpisodeResponseDto>>>> GetAll(
        [FromQuery] EpisodeFilterDto filter,

        CancellationToken ct)
    {
        var results = await _service.GetAllAsync(CurrentUserGuid, filter, ct);
        return Ok(ApiResponseFactory.Success(results, "Episodes retrieved successfully."));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<SuccessResponseDto<EpisodeResponseDto>>> GetById(Guid id, CancellationToken ct)
    {
        var result = await _service.GetByIdAsync(CurrentUserGuid, id, ct);
        return Ok(ApiResponseFactory.Success(result, "Episode retrieved successfully."));
    }

    [HttpPost]
    public async Task<ActionResult<SuccessResponseDto<EpisodeResponseDto>>> Create([FromBody] CreateEpisodeDto dto)
    {
        var result = await _service.CreateAsync(CurrentUserGuid, dto);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, ApiResponseFactory.Success(result, "Episode created successfully.", 201));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<SuccessResponseDto<EpisodeResponseDto>>> Update(Guid id, [FromBody] UpdateEpisodeDto dto)
    {
        var result = await _service.UpdateAsync(CurrentUserGuid, id, dto);
        return Ok(ApiResponseFactory.Success(result, "Episode updated successfully."));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponseDto>> Delete(Guid id)
    {
        await _service.DeleteAsync(CurrentUserGuid, id);
        return Ok(ApiResponseFactory.Success<object?>(null, "Episode deleted successfully."));
    }

    [HttpPost("{id}/generate-video")]
    public async Task<ActionResult<SuccessResponseDto<EpisodeResponseDto>>> GenerateVideo(Guid id)
    {
        var result = await _service.GenerateEpisodeVideoAsync(CurrentUserGuid, id);
        return Ok(ApiResponseFactory.Success(result, "Episode video generated successfully."));
    }

    [HttpPut("{id}/scenes/reorder")]
    public async Task<ActionResult<SuccessResponseDto<bool>>> ReorderScenes(Guid id, [FromBody] ReorderScenesDto dto)
    {
        var result = await _service.ReorderScenesAsync(CurrentUserGuid, id, dto.SceneIds);
        return Ok(ApiResponseFactory.Success(result, "Scenes reordered successfully."));
    }
}