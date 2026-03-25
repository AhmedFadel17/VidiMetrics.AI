using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Seo.SeoAudits;
using VidiMetrics.Application.Interfaces.Seo;
using VidiMetrics.API.Factories;
using VidiMetrics.Application.DTOs.Common;

namespace VidiMetrics.API.Controllers.Seo
{
    [Route("api/[controller]")]
    [ApiController]
    public class SeoAuditsController : ControllerBase
    {
        private readonly ISeoAuditsService _service;

        public SeoAuditsController(ISeoAuditsService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<SuccessResponseDto<IEnumerable<SeoAuditResponseDto>>>> GetAll()
        {
            var results = await _service.GetAllAsync();
            return Ok(ApiResponseFactory.Success(results, "SeoAudits retrieved successfully."));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SuccessResponseDto<SeoAuditResponseDto>>> GetById(Guid id)
        {
            var result = await _service.GetByIdAsync(id);
            return Ok(ApiResponseFactory.Success(result, "SeoAudit retrieved successfully."));
        }

        [HttpPost]
        public async Task<ActionResult<SuccessResponseDto<SeoAuditResponseDto>>> Create([FromBody] CreateSeoAuditDto dto)
        {
            var result = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, ApiResponseFactory.Success(result, "SeoAudit created successfully.", 201));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<SuccessResponseDto<SeoAuditResponseDto>>> Update(Guid id, [FromBody] UpdateSeoAuditDto dto)
        {
            var result = await _service.UpdateAsync(id, dto);
            return Ok(ApiResponseFactory.Success(result, "SeoAudit updated successfully."));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponseDto>> Delete(Guid id)
        {
            await _service.DeleteAsync(id);
            return Ok(ApiResponseFactory.Success<object?>(null, "SeoAudit deleted successfully."));
        }
    }
}
