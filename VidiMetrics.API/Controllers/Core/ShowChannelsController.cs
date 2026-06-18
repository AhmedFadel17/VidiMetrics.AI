using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VidiMetrics.API.Factories;
using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Application.DTOs.Core.ShowChannels;
using VidiMetrics.Application.Interfaces.Core;
using VidiMetrics.Domain.Models.Core;

namespace VidiMetrics.API.Controllers.Core
{
    [Route("api/show-channels")]
    [ApiController]
    [Authorize]
    public class ShowChannelsController : ApiBaseController
    {
        private readonly IShowChannelsService _service;

        public ShowChannelsController(IShowChannelsService service)
        {
            _service = service;
        }

        [HttpPost("connect")]
        public async Task<ActionResult<SuccessResponseDto<bool>>> Connect([FromBody] ConnectShowToChannelDto dto, CancellationToken ct)
        {
            var result = await _service.ConnectShowToChannelAsync(CurrentUserGuid, dto.ShowId, dto.ChannelId, ct);
            return Ok(ApiResponseFactory.Success(result, "Show connected to channel successfully."));
        }

        [HttpPost("disconnect")]
        public async Task<ActionResult<SuccessResponseDto<bool>>> Disconnect([FromBody] ConnectShowToChannelDto dto, CancellationToken ct)
        {
            var result = await _service.DisconnectShowFromChannelAsync(CurrentUserGuid, dto.ShowId, dto.ChannelId, ct);
            return Ok(ApiResponseFactory.Success(result, "Show disconnected from channel successfully."));
        }

        [HttpGet("show/{showId}")]
        public async Task<ActionResult<SuccessResponseDto<List<ShowChannel>>>> GetShowChannels(Guid showId, CancellationToken ct)
        {
            var result = await _service.GetShowChannelsAsync(CurrentUserGuid, showId, ct);
            return Ok(ApiResponseFactory.Success(result, "Show channels retrieved successfully."));
        }

        [HttpPut("{showChannelId}/settings")]
        public async Task<ActionResult<SuccessResponseDto<bool>>> UpdateSettings(Guid showChannelId, [FromBody] UpdateShowChannelSettingsDto dto, CancellationToken ct)
        {
            var result = await _service.UpdateShowChannelSettingsAsync(CurrentUserGuid, showChannelId, dto, ct);
            return Ok(ApiResponseFactory.Success(result, "Show channel settings updated successfully."));
        }
    }
}
