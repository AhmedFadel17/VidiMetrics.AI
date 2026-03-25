using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Ai.AiPromptTemplates;
using VidiMetrics.Application.Interfaces.Ai;
using VidiMetrics.API.Factories;
using VidiMetrics.Application.DTOs.Common;

namespace VidiMetrics.API.Controllers.Ai
{
    [Route("api/[controller]")]
    [ApiController]
    public class AiPromptTemplatesController : ControllerBase
    {
        private readonly IAiPromptTemplatesService _service;

        public AiPromptTemplatesController(IAiPromptTemplatesService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<SuccessResponseDto<IEnumerable<AiPromptTemplateResponseDto>>>> GetAll()
        {
            var results = await _service.GetAllAsync();
            return Ok(ApiResponseFactory.Success(results, "AiPromptTemplates retrieved successfully."));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SuccessResponseDto<AiPromptTemplateResponseDto>>> GetById(Guid id)
        {
            var result = await _service.GetByIdAsync(id);
            return Ok(ApiResponseFactory.Success(result, "AiPromptTemplate retrieved successfully."));
        }

        [HttpPost]
        public async Task<ActionResult<SuccessResponseDto<AiPromptTemplateResponseDto>>> Create([FromBody] CreateAiPromptTemplateDto dto)
        {
            var result = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, ApiResponseFactory.Success(result, "AiPromptTemplate created successfully.", 201));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<SuccessResponseDto<AiPromptTemplateResponseDto>>> Update(Guid id, [FromBody] UpdateAiPromptTemplateDto dto)
        {
            var result = await _service.UpdateAsync(id, dto);
            return Ok(ApiResponseFactory.Success(result, "AiPromptTemplate updated successfully."));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponseDto>> Delete(Guid id)
        {
            await _service.DeleteAsync(id);
            return Ok(ApiResponseFactory.Success<object?>(null, "AiPromptTemplate deleted successfully."));
        }
    }
}
