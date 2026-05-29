using Microsoft.AspNetCore.Mvc;
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

        string scheme = Request.Headers["X-Forwarded-Proto"].FirstOrDefault() ?? Request.Scheme;
        string host = Request.Headers["X-Forwarded-Host"].FirstOrDefault() ?? Request.Host.Value;

        string currentBackendRedirectUri = $"{scheme}://{host}{Request.Path}";

        await _service.ConnectChannelAsync(platform, userId, code, currentBackendRedirectUri);

        var uriBuilder = new UriBuilder(targetFrontendUrl);
        return Redirect(uriBuilder.ToString());
    }
}