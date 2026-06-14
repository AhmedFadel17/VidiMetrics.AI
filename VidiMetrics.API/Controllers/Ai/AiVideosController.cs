using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VidiMetrics.API.Factories;
using VidiMetrics.Application.DTOs.Ai.AiVideos;
using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Application.Interfaces.Ai;

namespace VidiMetrics.API.Controllers.Ai;

[ApiController]
[Route("api/ai/videos")]
[Authorize]
public class AiVideosController : ApiBaseController
{
    private readonly IAiVideosService _aiVideosService;

    public AiVideosController(IAiVideosService aiVideosService)
    {
        _aiVideosService = aiVideosService;
    }

    [HttpGet]
    public async Task<ActionResult<SuccessResponseDto<PaginationResponseDto<AiVideoResponseDto>>>> GetAllVideos(
        [FromQuery] AiVideoFilterDto filter,

        CancellationToken ct)
    {
        var results = await _aiVideosService.GetAllAsync(CurrentUserGuid, filter, ct);
        return Ok(ApiResponseFactory.Success(results, "Videos retrieved successfully."));
    }

    [HttpPost("scene")]
    public async Task<ActionResult<SuccessResponseDto<AiVideoResponseDto>>> CreateSceneVideo([FromBody] CreateSceneVideoDto dto)
    {
        var video = await _aiVideosService.CreateSceneVideoAsync(CurrentUserGuid, dto);
        return Ok(ApiResponseFactory.Success(video, "Scene video generated successfully.", 201));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<SuccessResponseDto<AiVideoResponseDto>>> GetById(Guid id, CancellationToken ct)
    {
        var result = await _aiVideosService.GetByIdAsync(CurrentUserGuid, id, ct);
        return Ok(ApiResponseFactory.Success(result, "Video retrieved successfully."));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<SuccessResponseDto<AiVideoResponseDto>>> Update(Guid id, [FromBody] UpdateAiVideoDto dto)
    {
        var result = await _aiVideosService.UpdateAsync(CurrentUserGuid, id, dto);
        return Ok(ApiResponseFactory.Success(result, "Video updated successfully."));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponseDto>> Delete(Guid id)
    {
        await _aiVideosService.DeleteAsync(CurrentUserGuid, id);
        return Ok(ApiResponseFactory.Success<object?>(null, "Video deleted successfully."));
    }
}