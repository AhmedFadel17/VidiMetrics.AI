using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.StoryEngine.Scenes;
using VidiMetrics.Application.Interfaces.StoryEngine;
using VidiMetrics.API.Factories;
using VidiMetrics.Application.DTOs.Common;

namespace VidiMetrics.API.Controllers.StoryEngine
{
    [Route("api/[controller]")]
    [ApiController]
    public class ScenesController : ControllerBase
    {
        private readonly IScenesService _service;

        public ScenesController(IScenesService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<SuccessResponseDto<IEnumerable<SceneResponseDto>>>> GetAll()
        {
            var results = await _service.GetAllAsync();
            return Ok(ApiResponseFactory.Success(results, "Scenes retrieved successfully."));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SuccessResponseDto<SceneResponseDto>>> GetById(Guid id)
        {
            var result = await _service.GetByIdAsync(id);
            return Ok(ApiResponseFactory.Success(result, "Scene retrieved successfully."));
        }

        [HttpPost]
        public async Task<ActionResult<SuccessResponseDto<SceneResponseDto>>> Create([FromBody] CreateSceneDto dto)
        {
            var result = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, ApiResponseFactory.Success(result, "Scene created successfully.", 201));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<SuccessResponseDto<SceneResponseDto>>> Update(Guid id, [FromBody] UpdateSceneDto dto)
        {
            var result = await _service.UpdateAsync(id, dto);
            return Ok(ApiResponseFactory.Success(result, "Scene updated successfully."));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponseDto>> Delete(Guid id)
        {
            await _service.DeleteAsync(id);
            return Ok(ApiResponseFactory.Success<object?>(null, "Scene deleted successfully."));
        }
    }
}
