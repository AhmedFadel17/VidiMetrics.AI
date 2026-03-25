using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Seo.CompetitorVideos;
using VidiMetrics.Application.Interfaces.Seo;
using VidiMetrics.API.Factories;
using VidiMetrics.Application.DTOs.Common;

namespace VidiMetrics.API.Controllers.Seo
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompetitorVideosController : ControllerBase
    {
        private readonly ICompetitorVideosService _service;

        public CompetitorVideosController(ICompetitorVideosService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<SuccessResponseDto<IEnumerable<CompetitorVideoResponseDto>>>> GetAll()
        {
            var results = await _service.GetAllAsync();
            return Ok(ApiResponseFactory.Success(results, "CompetitorVideos retrieved successfully."));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SuccessResponseDto<CompetitorVideoResponseDto>>> GetById(Guid id)
        {
            var result = await _service.GetByIdAsync(id);
            return Ok(ApiResponseFactory.Success(result, "CompetitorVideo retrieved successfully."));
        }

        [HttpPost]
        public async Task<ActionResult<SuccessResponseDto<CompetitorVideoResponseDto>>> Create([FromBody] CreateCompetitorVideoDto dto)
        {
            var result = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, ApiResponseFactory.Success(result, "CompetitorVideo created successfully.", 201));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<SuccessResponseDto<CompetitorVideoResponseDto>>> Update(Guid id, [FromBody] UpdateCompetitorVideoDto dto)
        {
            var result = await _service.UpdateAsync(id, dto);
            return Ok(ApiResponseFactory.Success(result, "CompetitorVideo updated successfully."));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponseDto>> Delete(Guid id)
        {
            await _service.DeleteAsync(id);
            return Ok(ApiResponseFactory.Success<object?>(null, "CompetitorVideo deleted successfully."));
        }
    }
}
