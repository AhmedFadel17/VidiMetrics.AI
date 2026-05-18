using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VidiMetrics.API.Factories;
using VidiMetrics.Application.DTOs.Ai.AiVideos;
using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Application.Interfaces.Ai;

namespace VidiMetrics.API.Controllers.Ai
{
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

        [HttpPost("scene")]
        public async Task<ActionResult<SuccessResponseDto<AiVideoResponseDto>>> CreateSceneVideo([FromBody] CreateSceneVideoDto dto)
        {
            var video = await _aiVideosService.CreateSceneVideoAsync(dto, CurrentUserGuid);
            return Ok(ApiResponseFactory.Success(video, "Scene video generated successfully.", 201));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SuccessResponseDto<AiVideoResponseDto>>> GetById(Guid id)
        {
            var result = await _aiVideosService.GetByIdAsync(id, CurrentUserGuid);
            return Ok(ApiResponseFactory.Success(result, "Video retrieved successfully."));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<SuccessResponseDto<AiVideoResponseDto>>> Update(Guid id, [FromBody] UpdateAiVideoDto dto)
        {
            var result = await _aiVideosService.UpdateAsync(id, dto, CurrentUserGuid);
            return Ok(ApiResponseFactory.Success(result, "Video updated successfully."));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponseDto>> Delete(Guid id)
        {
            await _aiVideosService.DeleteAsync(id, CurrentUserGuid);
            return Ok(ApiResponseFactory.Success<object?>(null, "Video deleted successfully."));
        }
    }
}
