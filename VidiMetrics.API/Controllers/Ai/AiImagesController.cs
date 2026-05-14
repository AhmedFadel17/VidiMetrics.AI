using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using VidiMetrics.API.Factories;
using VidiMetrics.Application.DTOs.Ai.AiImages;
using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Application.Interfaces.Ai;

namespace VidiMetrics.API.Controllers.Ai;

[ApiController]
[Route("api/ai/images")]
public class AiImagesController : ApiBaseController
{
    private readonly IAiImagesService _aiImagesService;

    public AiImagesController(IAiImagesService aiImagesService)
    {
        _aiImagesService = aiImagesService;
    }

    [HttpPost("character")]
    public async Task<ActionResult<SuccessResponseDto<AiImageResponseDto>>> CreateCharacterImage([FromBody] CreateCharacterImageDto dto)
    {
        var image = await _aiImagesService.CreateCharacterImageAsync(dto, CurrentUserGuid);
        return Ok(ApiResponseFactory.Success(image, "Character image created successfully.", 201));
    }

    [HttpPost("environment")]
    public async Task<ActionResult<SuccessResponseDto<AiImageResponseDto>>> CreateEnvironmentImage([FromBody] CreateEnvironmentImageDto dto)
    {
        var image = await _aiImagesService.CreateEnvironmentImageAsync(dto, CurrentUserGuid);
        return Ok(ApiResponseFactory.Success(image, "Environment image created successfully.", 201));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<SuccessResponseDto<AiImageResponseDto>>> GetById(Guid id)
    {
        var result = await _aiImagesService.GetByIdAsync(id, CurrentUserGuid);
        return Ok(ApiResponseFactory.Success(result, "Character retrieved successfully."));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<SuccessResponseDto<AiImageResponseDto>>> Update(Guid id, [FromBody] UpdateAiImageDto dto)
    {
        var result = await _aiImagesService.UpdateAsync(id, dto, CurrentUserGuid);
        return Ok(ApiResponseFactory.Success(result, "Character updated successfully."));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponseDto>> Delete(Guid id)
    {
        await _aiImagesService.DeleteAsync(id, CurrentUserGuid);
        return Ok(ApiResponseFactory.Success<object?>(null, "Character deleted successfully."));
    }

}
