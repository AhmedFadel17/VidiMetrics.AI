using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Seo.KeywordRankings;
using VidiMetrics.Application.Interfaces.Seo;
using VidiMetrics.API.Factories;
using VidiMetrics.Application.DTOs.Common;

namespace VidiMetrics.API.Controllers.Seo
{
    [Route("api/[controller]")]
    [ApiController]
    public class KeywordRankingsController : ControllerBase
    {
        private readonly IKeywordRankingsService _service;

        public KeywordRankingsController(IKeywordRankingsService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<SuccessResponseDto<IEnumerable<KeywordRankingResponseDto>>>> GetAll()
        {
            var results = await _service.GetAllAsync();
            return Ok(ApiResponseFactory.Success(results, "KeywordRankings retrieved successfully."));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SuccessResponseDto<KeywordRankingResponseDto>>> GetById(Guid id)
        {
            var result = await _service.GetByIdAsync(id);
            return Ok(ApiResponseFactory.Success(result, "KeywordRanking retrieved successfully."));
        }

        [HttpPost]
        public async Task<ActionResult<SuccessResponseDto<KeywordRankingResponseDto>>> Create([FromBody] CreateKeywordRankingDto dto)
        {
            var result = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, ApiResponseFactory.Success(result, "KeywordRanking created successfully.", 201));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<SuccessResponseDto<KeywordRankingResponseDto>>> Update(Guid id, [FromBody] UpdateKeywordRankingDto dto)
        {
            var result = await _service.UpdateAsync(id, dto);
            return Ok(ApiResponseFactory.Success(result, "KeywordRanking updated successfully."));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponseDto>> Delete(Guid id)
        {
            await _service.DeleteAsync(id);
            return Ok(ApiResponseFactory.Success<object?>(null, "KeywordRanking deleted successfully."));
        }
    }
}
