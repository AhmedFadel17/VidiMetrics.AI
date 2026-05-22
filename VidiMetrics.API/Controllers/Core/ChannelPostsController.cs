using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using VidiMetrics.API.Factories;
using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Application.DTOs.Core.ChannelPosts;
using VidiMetrics.Application.DTOs.Core.Channels;
using VidiMetrics.Application.Interfaces.Core;

namespace VidiMetrics.API.Controllers.Core
{
    [Route("api/channel/posts")]
    [ApiController]
    public class ChannelPostsController : ApiBaseController
    {
        private readonly IChannelPostsService _service;

        public ChannelPostsController(IChannelPostsService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<SuccessResponseDto<PaginationResponseDto<ChannelPostResponseDto>>>> GetAll([FromQuery] ChannelPostFilterDto filter)
        {
            var results = await _service.GetAllAsync(filter, CurrentUserGuid);
            return Ok(ApiResponseFactory.Success(results, "Channel posts retrieved successfully."));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SuccessResponseDto<ChannelResponseDto>>> GetById(Guid id)
        {
            var result = await _service.GetByIdAsync(id, CurrentUserGuid);
            return Ok(ApiResponseFactory.Success(result, "Channel post retrieved successfully."));
        }


        [HttpPost]
        public async Task<ActionResult<SuccessResponseDto<ChannelResponseDto>>> Create([FromBody] CreateChannelPostDto dto)
        {
            var result = await _service.CreateAsync(dto, CurrentUserGuid);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, ApiResponseFactory.Success(result, "Channel created successfully.", 201));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<SuccessResponseDto<ChannelResponseDto>>> Update(Guid id, [FromBody] UpdateChannelPostDto dto)
        {
            var result = await _service.UpdateAsync(id, dto, CurrentUserGuid);
            return Ok(ApiResponseFactory.Success(result, "Channel post updated successfully."));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponseDto>> Delete(Guid id)
        {
            await _service.DeleteAsync(id, CurrentUserGuid);
            return Ok(ApiResponseFactory.Success<object?>(null, "Channel post deleted successfully."));
        }
    }
}
