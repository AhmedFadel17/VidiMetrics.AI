using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VidiMetrics.API.Factories;
using VidiMetrics.Application.DTOs.Ai.AiScripts;
using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Application.Interfaces.Ai;

namespace VidiMetrics.API.Controllers.Ai;

[ApiController]
[Route("api/ai/scripts")]
[Authorize]
public class AiScriptsController : ApiBaseController
{
    private readonly IAiScriptsService _service;

    public AiScriptsController(IAiScriptsService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<SuccessResponseDto<PaginationResponseDto<AiScriptResponseDto>>>> GetAll(
        [FromQuery] AiScriptFilterDto filter,

        CancellationToken ct)
    {
        var results = await _service.GetAllAsync(CurrentUserGuid, filter, ct);
        return Ok(ApiResponseFactory.Success(results, "Scripts retrieved successfully."));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<SuccessResponseDto<AiScriptResponseDto>>> GetById(Guid id, CancellationToken ct)
    {
        var result = await _service.GetByIdAsync(CurrentUserGuid, id, ct);
        return Ok(ApiResponseFactory.Success(result, "Script retrieved successfully."));
    }

    [HttpPost]
    public async Task<ActionResult<SuccessResponseDto<AiScriptResponseDto>>> Create([FromBody] CreateAiScriptDto dto)
    {
        var result = await _service.CreateAsync(CurrentUserGuid, dto);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, ApiResponseFactory.Success(result, "Script created successfully.", 201));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<SuccessResponseDto<AiScriptResponseDto>>> Update(Guid id, [FromBody] UpdateAiScriptDto dto)
    {
        var result = await _service.UpdateAsync(CurrentUserGuid, id, dto);
        return Ok(ApiResponseFactory.Success(result, "Script updated successfully."));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponseDto>> Delete(Guid id)
    {
        await _service.DeleteAsync(CurrentUserGuid, id);
        return Ok(ApiResponseFactory.Success<object?>(null, "Script deleted successfully."));
    }
}