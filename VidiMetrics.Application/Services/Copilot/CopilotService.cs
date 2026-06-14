using System.Text.Json;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using VidiMetrics.Application.DTOs.Copilot;
using VidiMetrics.Application.Interfaces.Copilot;
using VidiMetrics.Application.Providers.Copilot;
using VidiMetrics.DataAccess.Repositories.Copilot.CopilotChats;
using VidiMetrics.DataAccess.Repositories.Copilot.CopilotDrafts;
using VidiMetrics.DataAccess.Repositories.Copilot.CopilotMessages;
using VidiMetrics.Domain.Enums.Copilot;
using VidiMetrics.Domain.Models.Copilot;

namespace VidiMetrics.Application.Services.Copilot;

public class CopilotService : ICopilotService
{
    private readonly ICopilotAiProvider _aiProvider;
    private readonly ICopilotChatsRepository _chatRepository;
    private readonly ICopilotMessagesRepository _messageRepository;
    private readonly ICopilotDraftsRepository _draftRepository;
    private readonly ICopilotExecutionRouter _executionRouter;
    private readonly ICopilotPayloadValidationService _payloadValidationService;
    private readonly IMapper _mapper;

    public CopilotService(
        ICopilotAiProvider aiProvider,
        ICopilotChatsRepository chatRepository,
        ICopilotMessagesRepository messageRepository,
        ICopilotDraftsRepository draftRepository,
        ICopilotExecutionRouter executionRouter,
        ICopilotPayloadValidationService payloadValidationService,
        IMapper mapper)
    {
        _aiProvider = aiProvider;
        _chatRepository = chatRepository;
        _messageRepository = messageRepository;
        _draftRepository = draftRepository;
        _executionRouter = executionRouter;
        _payloadValidationService = payloadValidationService;
        _mapper = mapper;
    }

    public async Task<SendCopilotMessageResponseDto> SendMessageAsync(
        Guid userId,
        SendCopilotMessageRequestDto dto,
        CancellationToken ct = default)
    {
        var chat = await GetOrCreateChatAsync(userId, dto.ChatId, ct);

        var userMessage = new CopilotMessage
        {
            ChatId = chat.Id,
            Role = CopilotMessageRole.User,
            Content = dto.Message,
            CreatedBy = userId
        };

        await _messageRepository.AddAsync(userMessage, ct);
        await _messageRepository.SaveChangesAsync(ct);

        var history = await _messageRepository.Query()
            .Where(x => x.ChatId == chat.Id && !x.IsDeleted)
            .OrderBy(x => x.CreatedAt)
            .ToListAsync(ct);

        var decision = await _aiProvider.GetDecisionAsync(history, ct);

        if (decision.Mode != CopilotResponseMode.Draft)
        {
            var assistantMessage = new CopilotMessage
            {
                ChatId = chat.Id,
                Role = CopilotMessageRole.Assistant,
                Content = decision.Answer,
                CreatedBy = userId
            };

            await _messageRepository.AddAsync(assistantMessage, ct);
            await _messageRepository.SaveChangesAsync(ct);

            return new SendCopilotMessageResponseDto
            {
                ChatId = chat.Id,
                MessageId = assistantMessage.Id,
                Type = decision.Mode,
                Message = assistantMessage.Content
            };
        }

        var payloadJson = JsonSerializer.Serialize(decision.Payload ?? new Dictionary<string, object>());

        var draft = new CopilotDraft
        {
            ChatId = chat.Id,
            UserId = userId,
            ActionType = decision.Action,
            EntityType = decision.Entity,
            EntityId = decision.EntityId,
            ParentEntityType = decision.ParentEntity,
            ParentEntityId = decision.ParentEntityId,
            UserPrompt = dto.Message,
            Summary = decision.Summary,
            PayloadJson = payloadJson,
            Status = CopilotDraftStatus.Pending,
            CreatedBy = userId
        };

        var payloadErrors = await _payloadValidationService.ValidateAsync(draft, ct);

        var missingFields = decision.MissingFields ?? new List<string>();
        var friendlyPayloadWarnings = payloadErrors.Any()
    ? new List<string> { "Some required fields are still missing or need adjustment before this draft can be executed." }
    : new List<string>();
        var warnings = (decision.ValidationWarnings ?? new List<string>())
            .Concat(friendlyPayloadWarnings)
            .Distinct()
            .ToList();

        draft.MissingFieldsJson = JsonSerializer.Serialize(missingFields);
        draft.ValidationWarningsJson = JsonSerializer.Serialize(warnings);

        await _draftRepository.AddAsync(draft, ct);
        await _draftRepository.SaveChangesAsync(ct);

        var assistantText = BuildDraftAssistantMessage(decision.Answer, draft.Summary, missingFields, warnings);

        var assistantMessageForDraft = new CopilotMessage
        {
            ChatId = chat.Id,
            Role = CopilotMessageRole.Assistant,
            Content = assistantText,
            CreatedBy = userId
        };

        await _messageRepository.AddAsync(assistantMessageForDraft, ct);
        await _messageRepository.SaveChangesAsync(ct);

        return new SendCopilotMessageResponseDto
        {
            ChatId = chat.Id,
            MessageId = assistantMessageForDraft.Id,
            Type = CopilotResponseMode.Draft,
            Message = assistantText,
            Draft = new CopilotDraftPreviewDto
            {
                DraftId = draft.Id,
                ActionType = draft.ActionType,
                EntityType = draft.EntityType,
                Summary = draft.Summary,
                Payload = decision.Payload,
                MissingFields = missingFields,
                ValidationWarnings = warnings,
                CanExecute = !missingFields.Any() && !payloadErrors.Any()
            }
        };
    }

    public async Task<ReviewCopilotDraftResponseDto> ReviewDraftAsync(
        Guid userId,
        ReviewCopilotDraftRequestDto dto,
        CancellationToken ct = default)
    {
        var draft = await _draftRepository.Query()
            .FirstOrDefaultAsync(x => x.Id == dto.DraftId && !x.IsDeleted, ct)
            ?? throw new InvalidOperationException("Draft not found.");

        if (draft.UserId != userId)
            throw new UnauthorizedAccessException("You do not have access to this draft.");

        if (draft.Status != CopilotDraftStatus.Pending)
            throw new InvalidOperationException("Draft is no longer pending.");

        if (!dto.Accept)
        {
            draft.Status = CopilotDraftStatus.Rejected;
            draft.UpdatedAt = DateTime.UtcNow;
            _draftRepository.Update(draft);
            await _draftRepository.SaveChangesAsync(ct);

            return new ReviewCopilotDraftResponseDto
            {
                DraftId = draft.Id,
                Status = draft.Status,
                Message = "Draft rejected."
            };
        }

        var payloadErrors = await _payloadValidationService.ValidateAsync(draft, ct);

        if (payloadErrors.Any())
        {
            draft.Status = CopilotDraftStatus.Failed;
            draft.ErrorMessage = string.Join(" | ", payloadErrors);
            draft.UpdatedAt = DateTime.UtcNow;
            _draftRepository.Update(draft);
            await _draftRepository.SaveChangesAsync(ct);

            return new ReviewCopilotDraftResponseDto
            {
                DraftId = draft.Id,
                Status = draft.Status,
                Message = "Draft failed validation before execution.",
                Result = new { PayloadErrors = payloadErrors }
            };
        }

        try
        {
            var result = await _executionRouter.ExecuteAsync(userId, draft, ct);

            draft.Status = CopilotDraftStatus.Executed;
            draft.ExecutionResultJson = JsonSerializer.Serialize(result);
            draft.UpdatedAt = DateTime.UtcNow;

            _draftRepository.Update(draft);
            await _draftRepository.SaveChangesAsync(ct);

            return new ReviewCopilotDraftResponseDto
            {
                DraftId = draft.Id,
                Status = draft.Status,
                Message = "Draft executed successfully.",
                Result = result
            };
        }
        catch (Exception ex)
        {
            draft.Status = CopilotDraftStatus.Failed;
            draft.ErrorMessage = ex.Message;
            draft.UpdatedAt = DateTime.UtcNow;

            _draftRepository.Update(draft);
            await _draftRepository.SaveChangesAsync(ct);

            return new ReviewCopilotDraftResponseDto
            {
                DraftId = draft.Id,
                Status = draft.Status,
                Message = "Draft execution failed.",
                Result = ex.Message
            };
        }
    }

    public async Task<List<CopilotChatResponseDto>> GetChatsAsync(Guid userId, CancellationToken ct = default)
    {
        return await _chatRepository.Query()
            .Where(x => x.UserId == userId && !x.IsDeleted)
            .OrderByDescending(x => x.UpdatedAt)
            .ProjectTo<CopilotChatResponseDto>(_mapper.ConfigurationProvider)
            .ToListAsync(ct);
    }

    public async Task<CopilotChatResponseDto> CreateChatAsync(Guid userId, CreateCopilotChatDto dto, CancellationToken ct = default)
    {
        var chat = new CopilotChat
        {
            UserId = userId,
            Title = string.IsNullOrWhiteSpace(dto.Title) ? "New Copilot Chat" : dto.Title.Trim(),
            CreatedBy = userId
        };

        await _chatRepository.AddAsync(chat, ct);
        await _chatRepository.SaveChangesAsync(ct);

        return _mapper.Map<CopilotChatResponseDto>(chat);
    }

    public async Task<CopilotChatResponseDto> GetChatByIdAsync(Guid userId, Guid chatId, CancellationToken ct = default)
    {
        var chat = await _chatRepository.Query()
            .FirstOrDefaultAsync(x => x.Id == chatId && !x.IsDeleted, ct)
            ?? throw new InvalidOperationException("Chat not found.");

        if (chat.UserId != userId)
            throw new UnauthorizedAccessException("You do not have access to this chat.");

        return _mapper.Map<CopilotChatResponseDto>(chat);
    }

    public async Task<List<CopilotMessageResponseDto>> GetChatMessagesAsync(Guid userId, Guid chatId, CancellationToken ct = default)
    {
        await EnsureChatOwnershipAsync(userId, chatId, ct);

        return await _messageRepository.Query()
            .Where(x => x.ChatId == chatId && !x.IsDeleted)
            .OrderBy(x => x.CreatedAt)
            .ProjectTo<CopilotMessageResponseDto>(_mapper.ConfigurationProvider)
            .ToListAsync(ct);
    }

    public async Task<List<CopilotDraftResponseDto>> GetChatDraftsAsync(Guid userId, Guid chatId, CancellationToken ct = default)
    {
        await EnsureChatOwnershipAsync(userId, chatId, ct);

        return await _draftRepository.Query()
            .Where(x => x.ChatId == chatId && !x.IsDeleted)
            .OrderByDescending(x => x.CreatedAt)
            .ProjectTo<CopilotDraftResponseDto>(_mapper.ConfigurationProvider)
            .ToListAsync(ct);
    }

    private async Task EnsureChatOwnershipAsync(Guid userId, Guid chatId, CancellationToken ct)
    {
        var chat = await _chatRepository.Query()
            .FirstOrDefaultAsync(x => x.Id == chatId && !x.IsDeleted, ct)
            ?? throw new InvalidOperationException("Chat not found.");

        if (chat.UserId != userId)
            throw new UnauthorizedAccessException("You do not have access to this chat.");
    }

    private async Task<CopilotChat> GetOrCreateChatAsync(Guid userId, Guid? chatId, CancellationToken ct)
    {
        if (chatId.HasValue)
        {
            var existing = await _chatRepository.Query()
                .FirstOrDefaultAsync(x => x.Id == chatId.Value && !x.IsDeleted, ct);

            if (existing == null)
                throw new InvalidOperationException("Chat not found.");

            if (existing.UserId != userId)
                throw new UnauthorizedAccessException("You do not have access to this chat.");

            return existing;
        }

        var chat = new CopilotChat
        {
            UserId = userId,
            Title = "New Copilot Chat",
            CreatedBy = userId
        };

        await _chatRepository.AddAsync(chat, ct);
        await _chatRepository.SaveChangesAsync(ct);
        return chat;
    }

    private static string BuildDraftAssistantMessage(
        string answer,
        string summary,
        List<string> missingFields,
        List<string> warnings)
    {
        var parts = new List<string>();

        if (!string.IsNullOrWhiteSpace(answer))
            parts.Add(answer);

        if (!string.IsNullOrWhiteSpace(summary))
            parts.Add($"Draft summary: {summary}");

        if (missingFields.Any())
            parts.Add($"Missing fields: {string.Join(", ", missingFields)}");

        if (warnings.Any())
            parts.Add($"Warnings: {string.Join(" | ", warnings)}");

        parts.Add("Please review and accept or reject the draft.");

        return string.Join(Environment.NewLine, parts);
    }
}