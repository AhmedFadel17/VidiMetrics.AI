using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using VidiMetrics.Application.DTOs.Ai.AiVideos;
using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Application.Interfaces.Ai;
using VidiMetrics.Application.Interfaces.Infra;
using VidiMetrics.Application.Providers.NotificationsProviders;
using VidiMetrics.Application.Providers.VideoProviders;
using VidiMetrics.DataAccess.Repositories.Ai.AiScripts;
using VidiMetrics.DataAccess.Repositories.Ai.AiVideos;
using VidiMetrics.Domain.Enums.Ai;
using VidiMetrics.Domain.Enums.Infra;
using VidiMetrics.Domain.Models.Ai;

namespace VidiMetrics.Application.Services.Ai;

public class AiVideosService : IAiVideosService
{
    private readonly IMapper _mapper;
    private readonly IAiVideosRepository _repo;
    private readonly IAiScriptsRepository _aiScriptsRepository;
    private readonly IVideoProvider _videoProvider;
    private readonly IValidator<UpdateAiVideoDto> _updateValidator;
    private readonly IValidator<CreateSceneVideoDto> _createValidator;
    private readonly ICreditTransactionManager _creditManager;
    private readonly INotificationProvider _notificationProvider;

    public AiVideosService(
        IMapper mapper,
        IAiVideosRepository repo,
        IAiScriptsRepository aiScriptsRepository,
        IVideoProvider videoProvider,
        IValidator<UpdateAiVideoDto> updateValidator,
        IValidator<CreateSceneVideoDto> createValidator,
        ICreditTransactionManager creditManager,
        INotificationProvider notificationProvider)
    {
        _mapper = mapper;
        _repo = repo;
        _aiScriptsRepository = aiScriptsRepository;
        _videoProvider = videoProvider;
        _updateValidator = updateValidator;
        _createValidator = createValidator;
        _creditManager = creditManager;
        _notificationProvider = notificationProvider;
    }

    public async Task<AiVideoResponseDto> CreateSceneVideoAsync(Guid userId, CreateSceneVideoDto dto)
    {
        await _createValidator.ValidateAndThrowAsync(dto);

        var script = await _aiScriptsRepository.Query()
            .FirstOrDefaultAsync(e => e.Id == dto.ScriptId && e.UserId == userId);

        if (script == null) throw new UnauthorizedAccessException("Script not found or access denied.");

        var seed = new Random().Next(1, 999999);
        return await _creditManager.ExecuteWithCreditsAsync(
            userId,
            CreditActionType.GenerateVideo,
            "Video Generation",
            async () =>
            {
                VideoGenerationResult providerResult = await _videoProvider.GenerateVideoAsync(script.VisualPrompt, seed);
                var video = new AiVideo
                {
                    VideoUrl = providerResult.VideoUrl,
                    ThumbnailUrl = providerResult.ThumbnailUrl,
                    Duration = providerResult.Duration,
                    Size = providerResult.SizeInBytes,
                    Seed = seed,
                    UserId = userId,
                };

                await _repo.AddAsync(video);
                await _repo.SaveChangesAsync();

                await _notificationProvider.SendInAppNotificationAsync(
                    userId,
                    "Video Generated",
                    "Your AI Video has been generated successfully.",
                    NotificationType.Success,
                    true,
                    $"User {userId} generated a new AI Video."
                );

                return _mapper.Map<AiVideoResponseDto>(video);
            });
    }

    public async Task<bool> DeleteAsync(Guid userId, Guid id)
    {
        var entity = await _repo.Query().FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);
        if (entity == null) throw new KeyNotFoundException("Video not found.");

        _repo.Remove(entity);
        return await _repo.SaveChangesAsync();
    }

    public async Task<PaginationResponseDto<AiVideoResponseDto>> GetAllAsync(Guid userId, AiVideoFilterDto filter, CancellationToken ct = default)
    {
        IQueryable<AiVideo> query = _repo.Query();
        query = query.Where(x => x.UserId == userId);

        if (filter.AssetType.HasValue)
        {
            if (filter.AssetType.Value == AssetType.Unlinked)
            {
                query = query.Where(x => !x.IsLinked);
            }
            else
            {
                query = query.Where(x => x.AssetType == filter.AssetType.Value);
            }
        }

        var (entities, totalCount) = await _repo.GetAllWithPaginationAsync(
            query,
            filter.PageNumber,
            filter.PageSize,
            filter.OrderBy,
            filter.SortOrder,
            filter.Limit,
            cancellationToken: ct);

        var paginationSource = new PaginationSource<AiVideo>(entities.ToList(), filter.PageNumber, filter.PageSize, totalCount);
        return _mapper.Map<PaginationResponseDto<AiVideoResponseDto>>(paginationSource);
    }

    public async Task<AiVideoResponseDto> GetByIdAsync(Guid userId, Guid id, CancellationToken ct = default)
    {
        var entity = await _repo.Query().FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId, cancellationToken: ct);
        if (entity == null) throw new KeyNotFoundException("Video not found.");
        return _mapper.Map<AiVideoResponseDto>(entity);
    }

    public async Task<AiVideoResponseDto> UpdateAsync(Guid userId, Guid id, UpdateAiVideoDto dto)
    {
        await _updateValidator.ValidateAndThrowAsync(dto);
        var entity = await _repo.Query().FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);
        if (entity == null) throw new KeyNotFoundException("Video not found.");

        _mapper.Map(dto, entity);
        entity.UpdatedAt = DateTime.UtcNow;

        _repo.Update(entity);
        await _repo.SaveChangesAsync();

        return _mapper.Map<AiVideoResponseDto>(entity);
    }
}