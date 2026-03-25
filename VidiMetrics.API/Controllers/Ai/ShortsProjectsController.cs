using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Ai.ShortsProjects;
using VidiMetrics.Application.Interfaces.Ai;
using VidiMetrics.API.Factories;
using VidiMetrics.Application.DTOs.Common;

namespace VidiMetrics.API.Controllers.Ai
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShortsProjectsController : ControllerBase
    {
        private readonly IShortsProjectsService _service;

        public ShortsProjectsController(IShortsProjectsService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<SuccessResponseDto<IEnumerable<ShortsProjectResponseDto>>>> GetAll()
        {
            var results = await _service.GetAllAsync();
            return Ok(ApiResponseFactory.Success(results, "ShortsProjects retrieved successfully."));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SuccessResponseDto<ShortsProjectResponseDto>>> GetById(Guid id)
        {
            var result = await _service.GetByIdAsync(id);
            return Ok(ApiResponseFactory.Success(result, "ShortsProject retrieved successfully."));
        }

        [HttpPost]
        public async Task<ActionResult<SuccessResponseDto<ShortsProjectResponseDto>>> Create([FromBody] CreateShortsProjectDto dto)
        {
            var result = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, ApiResponseFactory.Success(result, "ShortsProject created successfully.", 201));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<SuccessResponseDto<ShortsProjectResponseDto>>> Update(Guid id, [FromBody] UpdateShortsProjectDto dto)
        {
            var result = await _service.UpdateAsync(id, dto);
            return Ok(ApiResponseFactory.Success(result, "ShortsProject updated successfully."));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponseDto>> Delete(Guid id)
        {
            await _service.DeleteAsync(id);
            return Ok(ApiResponseFactory.Success<object?>(null, "ShortsProject deleted successfully."));
        }
    }
}
