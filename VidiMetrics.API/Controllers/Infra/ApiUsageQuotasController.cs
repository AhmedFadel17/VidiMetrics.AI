using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Infra.ApiUsageQuotas;
using VidiMetrics.Application.Interfaces.Infra;
using VidiMetrics.API.Factories;
using VidiMetrics.Application.DTOs.Common;

namespace VidiMetrics.API.Controllers.Infra
{
    [Route("api/[controller]")]
    [ApiController]
    public class ApiUsageQuotasController : ControllerBase
    {
        private readonly IApiUsageQuotasService _service;

        public ApiUsageQuotasController(IApiUsageQuotasService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<SuccessResponseDto<IEnumerable<ApiUsageQuotaResponseDto>>>> GetAll()
        {
            var results = await _service.GetAllAsync();
            return Ok(ApiResponseFactory.Success(results, "ApiUsageQuotas retrieved successfully."));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SuccessResponseDto<ApiUsageQuotaResponseDto>>> GetById(Guid id)
        {
            var result = await _service.GetByIdAsync(id);
            return Ok(ApiResponseFactory.Success(result, "ApiUsageQuota retrieved successfully."));
        }

        [HttpPost]
        public async Task<ActionResult<SuccessResponseDto<ApiUsageQuotaResponseDto>>> Create([FromBody] CreateApiUsageQuotaDto dto)
        {
            var result = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, ApiResponseFactory.Success(result, "ApiUsageQuota created successfully.", 201));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<SuccessResponseDto<ApiUsageQuotaResponseDto>>> Update(Guid id, [FromBody] UpdateApiUsageQuotaDto dto)
        {
            var result = await _service.UpdateAsync(id, dto);
            return Ok(ApiResponseFactory.Success(result, "ApiUsageQuota updated successfully."));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponseDto>> Delete(Guid id)
        {
            await _service.DeleteAsync(id);
            return Ok(ApiResponseFactory.Success<object?>(null, "ApiUsageQuota deleted successfully."));
        }
    }
}
