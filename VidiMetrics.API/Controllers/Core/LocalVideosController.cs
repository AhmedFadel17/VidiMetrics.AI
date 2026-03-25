using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Core.LocalVideos;
using VidiMetrics.Application.Interfaces.Core;
using VidiMetrics.API.Factories;
using VidiMetrics.Application.DTOs.Common;

namespace VidiMetrics.API.Controllers.Core
{
    [Route("api/[controller]")]
    [ApiController]
    public class LocalVideosController : ControllerBase
    {
        private readonly ILocalVideosService _service;

        public LocalVideosController(ILocalVideosService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<SuccessResponseDto<IEnumerable<LocalVideoResponseDto>>>> GetAll()
        {
            var results = await _service.GetAllAsync();
            return Ok(ApiResponseFactory.Success(results, "LocalVideos retrieved successfully."));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SuccessResponseDto<LocalVideoResponseDto>>> GetById(Guid id)
        {
            var result = await _service.GetByIdAsync(id);
            return Ok(ApiResponseFactory.Success(result, "LocalVideo retrieved successfully."));
        }

        [HttpPost]
        public async Task<ActionResult<SuccessResponseDto<LocalVideoResponseDto>>> Create([FromBody] CreateLocalVideoDto dto)
        {
            var result = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, ApiResponseFactory.Success(result, "LocalVideo created successfully.", 201));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<SuccessResponseDto<LocalVideoResponseDto>>> Update(Guid id, [FromBody] UpdateLocalVideoDto dto)
        {
            var result = await _service.UpdateAsync(id, dto);
            return Ok(ApiResponseFactory.Success(result, "LocalVideo updated successfully."));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponseDto>> Delete(Guid id)
        {
            await _service.DeleteAsync(id);
            return Ok(ApiResponseFactory.Success<object?>(null, "LocalVideo deleted successfully."));
        }
    }
}
