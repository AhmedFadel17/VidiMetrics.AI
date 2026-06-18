using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VidiMetrics.API.Controllers;
using VidiMetrics.API.Factories;
using VidiMetrics.Application.DTOs.Ai.MediaStats;
using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Application.Interfaces.Ai;

namespace VidiMetrics.API.Controllers.Ai;

[ApiController]
[Route("api/ai/media")]
[Authorize]
public class MediaController : ApiBaseController
{
    private readonly IMediaService _service;
    public MediaController(IMediaService service) => _service = service;


    [HttpGet("stats")]
    public async Task<ActionResult<SuccessResponseDto<MediaStatsResponseDto>>> GetStats(CancellationToken ct)
    {
        var result = await _service.GetStatsAsync(CurrentUserGuid, ct);
        return Ok(ApiResponseFactory.Success(result, "Stats retrieved successfully."));
    }
}
