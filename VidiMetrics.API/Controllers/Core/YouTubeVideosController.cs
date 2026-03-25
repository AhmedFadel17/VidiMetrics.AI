using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Core.YouTubeVideos;
using VidiMetrics.Application.Interfaces.Core;
using VidiMetrics.API.Factories;
using VidiMetrics.Application.DTOs.Common;

namespace VidiMetrics.API.Controllers.Core
{
    [Route("api/[controller]")]
    [ApiController]
    public class YouTubeVideosController : ControllerBase
    {
        private readonly IYouTubeVideosService _service;

        public YouTubeVideosController(IYouTubeVideosService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<SuccessResponseDto<IEnumerable<YouTubeVideoResponseDto>>>> GetAll()
        {
            var results = await _service.GetAllAsync();
            return Ok(ApiResponseFactory.Success(results, "YouTubeVideos retrieved successfully."));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SuccessResponseDto<YouTubeVideoResponseDto>>> GetById(Guid id)
        {
            var result = await _service.GetByIdAsync(id);
            return Ok(ApiResponseFactory.Success(result, "YouTubeVideo retrieved successfully."));
        }

        [HttpPost]
        public async Task<ActionResult<SuccessResponseDto<YouTubeVideoResponseDto>>> Create([FromBody] CreateYouTubeVideoDto dto)
        {
            var result = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, ApiResponseFactory.Success(result, "YouTubeVideo created successfully.", 201));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<SuccessResponseDto<YouTubeVideoResponseDto>>> Update(Guid id, [FromBody] UpdateYouTubeVideoDto dto)
        {
            var result = await _service.UpdateAsync(id, dto);
            return Ok(ApiResponseFactory.Success(result, "YouTubeVideo updated successfully."));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponseDto>> Delete(Guid id)
        {
            await _service.DeleteAsync(id);
            return Ok(ApiResponseFactory.Success<object?>(null, "YouTubeVideo deleted successfully."));
        }
    }
}
