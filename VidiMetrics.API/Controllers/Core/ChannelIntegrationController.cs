using Microsoft.AspNetCore.Mvc;
using VidiMetrics.API.Factories;
using VidiMetrics.Application.Interfaces;
using VidiMetrics.Application.Interfaces.Core;
using VidiMetrics.Domain.Enums;

namespace VidiMetrics.API.Controllers.Core;

[ApiController]
[Route("api/integrations")]
public class ChannelIntegrationController : ControllerBase
{
    private readonly IChannelsService _service;

    public ChannelIntegrationController(IChannelsService service)
    {
        _service = service;
    }

    [HttpGet("callback/{platform}")]
    public async Task<IActionResult> HandleOAuthCallback(
        [FromRoute] TargetPlatform platform,
        [FromQuery] string code,
        [FromQuery] string state)
    {
        var stateSegments = state.Split('|');

        if (stateSegments.Length < 2)
        {
            return BadRequest("OAuth lifecycle state token parameter is corrupted.");
        }

        var userId = Guid.Parse(stateSegments[0]);
        string targetFrontendUrl = stateSegments[1];
        string currentBackendRedirectUri = $"{Request.Scheme}://{Request.Host}{Request.Path}";

        await _service.ConnectChannelAsync(platform, userId, code, currentBackendRedirectUri);

        var uriBuilder = new UriBuilder(targetFrontendUrl);
        return Redirect(uriBuilder.ToString());
    }
}
