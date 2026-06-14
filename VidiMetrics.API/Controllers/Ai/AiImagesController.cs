using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VidiMetrics.API.Factories;
using VidiMetrics.Application.DTOs.Ai.AiImages;
using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Application.Interfaces.Ai;

namespace VidiMetrics.API.Controllers.Ai;

[ApiController]
[Route("api/ai/images")]
[Authorize]
public class AiImagesController : ApiBaseController
{
    private readonly IAiImagesService _aiImagesService;

    public AiImagesController(IAiImagesService aiImagesService)
    {
        _aiImagesService = aiImagesService;
    }

    [HttpGet]
    public async Task<ActionResult<SuccessResponseDto<PaginationResponseDto<AiImageResponseDto>>>> GetAllImages(
        [FromQuery] AiImageFilterDto filter,

        CancellationToken ct)
    {
        var results = await _aiImagesService.GetAllAsync(CurrentUserGuid, filter, ct);
        return Ok(ApiResponseFactory.Success(results, "Images retrieved successfully."));
    }

    [HttpPost("character")]
    public async Task<ActionResult<SuccessResponseDto<AiImageResponseDto>>> CreateCharacterImage([FromBody] CreateCharacterImageDto dto)
    {
        var image = await _aiImagesService.CreateCharacterImageAsync(CurrentUserGuid, dto);
        return Ok(ApiResponseFactory.Success(image, "Character image created successfully.", 201));
    }

    [HttpPost("location")]
    public async Task<ActionResult<SuccessResponseDto<AiImageResponseDto>>> CreateLocationImage([FromBody] CreateLocationImageDto dto)
    {
        var image = await _aiImagesService.CreateLocationImageAsync(CurrentUserGuid, dto);
        return Ok(ApiResponseFactory.Success(image, "Location image created successfully.", 201));
    }

    [HttpPost("show")]
    public async Task<ActionResult<SuccessResponseDto<AiImageResponseDto>>> CreateShowImage([FromBody] CreateShowImageDto dto)
    {
        var image = await _aiImagesService.CreateShowImageAsync(CurrentUserGuid, dto);
        return Ok(ApiResponseFactory.Success(image, "Series image created successfully.", 201));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<SuccessResponseDto<AiImageResponseDto>>> GetById(Guid id, CancellationToken ct)
    {
        var result = await _aiImagesService.GetByIdAsync(CurrentUserGuid, id, ct);
        return Ok(ApiResponseFactory.Success(result, "Character retrieved successfully."));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<SuccessResponseDto<AiImageResponseDto>>> Update(Guid id, [FromBody] UpdateAiImageDto dto)
    {
        var result = await _aiImagesService.UpdateAsync(CurrentUserGuid, id, dto);
        return Ok(ApiResponseFactory.Success(result, "Character updated successfully."));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponseDto>> Delete(Guid id)
    {
        await _aiImagesService.DeleteAsync(CurrentUserGuid, id);
        return Ok(ApiResponseFactory.Success<object?>(null, "Character deleted successfully."));
    }
}