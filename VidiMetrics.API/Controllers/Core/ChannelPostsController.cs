using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VidiMetrics.API.Factories;
using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Application.DTOs.Core.ChannelPosts;
using VidiMetrics.Application.Interfaces.Core;

namespace VidiMetrics.API.Controllers.Core
{
    [Route("api/channel/posts")]
    [ApiController]
    [Authorize]
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
        public async Task<ActionResult<SuccessResponseDto<ChannelPostResponseDto>>> GetById(Guid id)
        {
            var result = await _service.GetByIdAsync(id, CurrentUserGuid);
            return Ok(ApiResponseFactory.Success(result, "Channel post retrieved successfully."));
        }

        [HttpPost]
        public async Task<ActionResult<SuccessResponseDto<ChannelPostResponseDto>>> Create([FromBody] CreateChannelPostDto dto)
        {
            var result = await _service.CreateAsync(dto, CurrentUserGuid);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, ApiResponseFactory.Success(result, "Channel post created successfully.", 201));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<SuccessResponseDto<ChannelPostResponseDto>>> Update(Guid id, [FromBody] UpdateChannelPostDto dto)
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

        [HttpPost("draft/episode")]
        public async Task<ActionResult<SuccessResponseDto<ChannelPostResponseDto>>> CreateDraftForEpisode([FromBody] CreateEpisodeDraftPostRequest request)
        {
            var result = await _service.CreateDraftPostForEpisodeAsync(CurrentUserGuid, request.ChannelId, request.EpisodeId, request.ScheduledAt);
            return Ok(ApiResponseFactory.Success(result, "Episode draft post created successfully."));
        }

        [HttpPost("draft/scene")]
        public async Task<ActionResult<SuccessResponseDto<ChannelPostResponseDto>>> CreateDraftForScene([FromBody] CreateSceneDraftPostRequest request)
        {
            var result = await _service.CreateDraftPostForSceneAsync(CurrentUserGuid, request.ChannelId, request.SceneId, request.ScheduledAt);
            return Ok(ApiResponseFactory.Success(result, "Scene draft post created successfully."));
        }

        [HttpPost("{id}/schedule")]
        public async Task<ActionResult<SuccessResponseDto<bool>>> Schedule(Guid id, [FromBody] SchedulePostRequest request)
        {
            var result = await _service.SchedulePostAsync(CurrentUserGuid, id, request.ScheduledAt);
            return Ok(ApiResponseFactory.Success(result, "Channel post scheduled successfully."));
        }

        [HttpPost("{id}/publish")]
        public async Task<ActionResult<SuccessResponseDto<bool>>> Publish(Guid id)
        {
            var result = await _service.PublishPostAsync(CurrentUserGuid, id);
            return Ok(ApiResponseFactory.Success(result, "Channel post published successfully."));
        }
    }

    public record CreateEpisodeDraftPostRequest
    {
        public Guid EpisodeId { get; set; }
        public Guid ChannelId { get; set; }
        public DateTime? ScheduledAt { get; set; }
    }

    public record CreateSceneDraftPostRequest
    {
        public Guid SceneId { get; set; }
        public Guid ChannelId { get; set; }
        public DateTime? ScheduledAt { get; set; }
    }

    public record SchedulePostRequest
    {
        public DateTime ScheduledAt { get; set; }
    }
}
