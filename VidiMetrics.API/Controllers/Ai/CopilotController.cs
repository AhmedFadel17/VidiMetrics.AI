using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VidiMetrics.API.Factories;
using VidiMetrics.Application.DTOs.Copilot;
using VidiMetrics.Application.Interfaces.Copilot;
namespace VidiMetrics.API.Controllers.Ai;

[ApiController]
[Route("api/copilot")]
[Authorize]
public class CopilotController : ApiBaseController
{
    private readonly ICopilotService _copilotService;

    public CopilotController(ICopilotService copilotService)
    {
        _copilotService = copilotService;
    }

    [HttpPost("message")]
    public async Task<ActionResult<SendCopilotMessageResponseDto>> SendMessage(
        [FromBody] SendCopilotMessageRequestDto request,
        CancellationToken ct)
    {
        var result = await _copilotService.SendMessageAsync(CurrentUserGuid, request, ct);
        return Ok(ApiResponseFactory.Success(result, "Message sent successfully.", 200));
    }

    [HttpPost("drafts/review")]
    public async Task<ActionResult<ReviewCopilotDraftResponseDto>> ReviewDraft(
        [FromBody] ReviewCopilotDraftRequestDto request,
        CancellationToken ct)
    {
        var result = await _copilotService.ReviewDraftAsync(CurrentUserGuid, request, ct);
        return Ok(ApiResponseFactory.Success(result, "Draft reviewed successfully.", 200));
    }

    [HttpGet("chats")]
    public async Task<ActionResult<List<CopilotChatResponseDto>>> GetChats(CancellationToken ct)
    {
        var result = await _copilotService.GetChatsAsync(CurrentUserGuid, ct);
        return Ok(ApiResponseFactory.Success(result, "Chats retrieved successfully.", 200));
    }

    [HttpPost("chats")]
    public async Task<ActionResult<CopilotChatResponseDto>> CreateChat(
        [FromBody] CreateCopilotChatDto dto,
        CancellationToken ct)
    {
        var result = await _copilotService.CreateChatAsync(CurrentUserGuid, dto, ct);
        return Ok(ApiResponseFactory.Success(result, "Chat created successfully.", 200));
    }

    [HttpGet("chats/{chatId:guid}")]
    public async Task<ActionResult<CopilotChatResponseDto>> GetChatById(Guid chatId, CancellationToken ct)
    {
        var result = await _copilotService.GetChatByIdAsync(CurrentUserGuid, chatId, ct);
        return Ok(ApiResponseFactory.Success(result, "Chat retrieved successfully.", 200));
    }

    [HttpGet("chats/{chatId:guid}/messages")]
    public async Task<ActionResult<List<CopilotMessageResponseDto>>> GetChatMessages(Guid chatId, CancellationToken ct)
    {
        var result = await _copilotService.GetChatMessagesAsync(CurrentUserGuid, chatId, ct);
        return Ok(ApiResponseFactory.Success(result, "Chat messages retrieved successfully.", 200));
    }

    [HttpGet("chats/{chatId:guid}/drafts")]
    public async Task<ActionResult<List<CopilotDraftResponseDto>>> GetChatDrafts(Guid chatId, CancellationToken ct)
    {
        var result = await _copilotService.GetChatDraftsAsync(CurrentUserGuid, chatId, ct);
        return Ok(ApiResponseFactory.Success(result, "Chat drafts retrieved successfully.", 200));
    }


    [HttpGet("stats")]
    public async Task<ActionResult<List<CopilotStatsResponseDto>>> GetStats(CancellationToken ct)
    {
        var result = await _copilotService.GetStatsAsync(CurrentUserGuid, IsAdmin, ct);
        return Ok(ApiResponseFactory.Success(result, "Stats retrieved successfully.", 200));
    }

}
