using VidiMetrics.Application.DTOs.Copilot;

namespace VidiMetrics.Application.Interfaces.Copilot;

public interface ICopilotService
{
    Task<SendCopilotMessageResponseDto> SendMessageAsync(Guid userId, SendCopilotMessageRequestDto request, CancellationToken ct = default);
    Task<ReviewCopilotDraftResponseDto> ReviewDraftAsync(Guid userId, ReviewCopilotDraftRequestDto request, CancellationToken ct = default);
    Task<List<CopilotChatResponseDto>> GetChatsAsync(Guid userId, CancellationToken ct = default);
    Task<CopilotChatResponseDto> CreateChatAsync(Guid userId, CreateCopilotChatDto request, CancellationToken ct = default);
    Task<CopilotChatResponseDto> GetChatByIdAsync(Guid userId, Guid chatId, CancellationToken ct = default);
    Task<List<CopilotMessageResponseDto>> GetChatMessagesAsync(Guid userId, Guid chatId, CancellationToken ct = default);
    Task<List<CopilotDraftResponseDto>> GetChatDraftsAsync(Guid userId, Guid chatId, CancellationToken ct = default);
}
