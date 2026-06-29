using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Application.DTOs.StoryEngine.Episodes;
using VidiMetrics.Application.Interfaces.StoryEngine;
using VidiMetrics.Application.Providers.NotificationsProviders;
using VidiMetrics.DataAccess.Repositories.StoryEngine.Episodes;
using VidiMetrics.DataAccess.Repositories.StoryEngine.Shows;
using VidiMetrics.Domain.Enums.Infra;
using VidiMetrics.Application.Interfaces.Infra;
using VidiMetrics.Application.Providers.VideoProviders;
using VidiMetrics.DataAccess.Repositories.Ai.AiVideos;
using VidiMetrics.Domain.Enums.Ai;
using VidiMetrics.Domain.Models.Ai;
using VidiMetrics.Domain.Models.StoryEngine;

namespace VidiMetrics.Application.Services.StoryEngine;

public class EpisodesService : IEpisodesService
{
    private readonly IEpisodesRepository _repository;
    private readonly IShowsRepository _showsRepository;
    private readonly IMapper _mapper;
    private readonly IValidator<CreateEpisodeDto> _createValidator;
    private readonly IValidator<UpdateEpisodeDto> _updateValidator;
    private readonly INotificationProvider _notificationProvider;
    private readonly IAiVideosRepository _aiVideosRepository;
    private readonly IVideoProvider _videoProvider;
    private readonly IFFmpegVideoProvider _ffmpegVideoProvider;
    private readonly ICreditTransactionManager _creditManager;

    public EpisodesService(
        IEpisodesRepository repository,
        IShowsRepository showsRepository,
        IMapper mapper,
        IValidator<CreateEpisodeDto> createValidator,
        IValidator<UpdateEpisodeDto> updateValidator,
        INotificationProvider notificationProvider,
        IAiVideosRepository aiVideosRepository,
        IVideoProvider videoProvider,
        IFFmpegVideoProvider ffmpegVideoProvider,
        ICreditTransactionManager creditManager)
    {
        _repository = repository;
        _showsRepository = showsRepository;
        _mapper = mapper;
        _createValidator = createValidator;
        _updateValidator = updateValidator;
        _notificationProvider = notificationProvider;
        _aiVideosRepository = aiVideosRepository;
        _videoProvider = videoProvider;
        _ffmpegVideoProvider = ffmpegVideoProvider;
        _creditManager = creditManager;
    }

    public async Task<EpisodeResponseDto> GetByIdAsync(Guid userId, Guid id, CancellationToken ct = default)
    {
        IQueryable<Episode> query = _repository.Query().Include(x => x.AiVideo);
        var entity = await query.FirstOrDefaultAsync(e => e.Id == id && e.Show.UserId == userId, cancellationToken: ct);
        if (entity == null) throw new KeyNotFoundException("Episode not found.");
        return _mapper.Map<EpisodeResponseDto>(entity);
    }

    public async Task<PaginationResponseDto<EpisodeResponseDto>> GetAllAsync(Guid userId, EpisodeFilterDto filter, CancellationToken ct = default)
    {
        IQueryable<Episode> query = _repository.Query().Include(x => x.AiVideo);
        query = query.Where(x => x.Show.UserId == userId);
        if (filter.ShowId.HasValue)
        {
            query = query.Where(x => x.ShowId == filter.ShowId.Value);
        }
        if (!string.IsNullOrWhiteSpace(filter.SearchTerm))
        {
            query = query.Where(x => x.Title.ToLower().Contains(filter.SearchTerm.ToLower()) ||
                                   x.PlotSummary.ToLower().Contains(filter.SearchTerm.ToLower()));
        }
        if (filter.CreatedAfter.HasValue)
        {
            query = query.Where(x => x.CreatedAt >= filter.CreatedAfter.Value);
        }
        if (filter.CreatedBefore.HasValue)
        {
            query = query.Where(x => x.CreatedAt <= filter.CreatedBefore.Value);
        }
        var (entities, totalCount) = await _repository.GetAllWithPaginationAsync(
            query,
            filter.PageNumber,
            filter.PageSize,
            filter.OrderBy,
            filter.SortOrder,
            filter.Limit,
            cancellationToken: ct);
        var paginationSource = new PaginationSource<Episode>(entities.ToList(), filter.PageNumber, filter.PageSize, totalCount);
        return _mapper.Map<PaginationResponseDto<EpisodeResponseDto>>(paginationSource);
    }

    public async Task<EpisodeResponseDto> CreateAsync(Guid userId, CreateEpisodeDto dto)
    {
        await _createValidator.ValidateAndThrowAsync(dto);
        var show = await _showsRepository.Query().FirstOrDefaultAsync(s => s.Id == dto.ShowId && s.UserId == userId);
        if (show == null) throw new UnauthorizedAccessException("Invalid Show selection or access denied.");
        if (dto.EpisodeNumber != show.TotalEpisodes + 1) throw new InvalidOperationException("Invalid Episode Number");
        var entity = _mapper.Map<Episode>(dto);
        entity.CreatedAt = DateTime.UtcNow;
        await _repository.AddAsync(entity);
        await _repository.SaveChangesAsync();
        await _notificationProvider.SendInAppNotificationAsync(
            userId,
            "Episode Created",
            $"Your episode '{entity.Title}' (Episode {entity.EpisodeNumber}) has been created successfully.",
            NotificationType.Success,
            true,
            $"User {userId} created a new episode titled '{entity.Title}' (Episode {entity.EpisodeNumber})."
        );
        return _mapper.Map<EpisodeResponseDto>(entity);
    }

    public async Task<EpisodeResponseDto> UpdateAsync(Guid userId, Guid id, UpdateEpisodeDto dto)
    {
        await _updateValidator.ValidateAndThrowAsync(dto);
        var entity = await _repository.Query().FirstOrDefaultAsync(x => x.Id == id && x.Show.UserId == userId);
        if (entity == null) throw new KeyNotFoundException("Episode not found.");
        _mapper.Map(dto, entity);
        entity.UpdatedAt = DateTime.UtcNow;
        _repository.Update(entity);
        await _repository.SaveChangesAsync();
        return _mapper.Map<EpisodeResponseDto>(entity);
    }

    public async Task<bool> DeleteAsync(Guid userId, Guid id)
    {
        var entity = await _repository.Query().FirstOrDefaultAsync(x => x.Id == id && x.Show.UserId == userId);
        if (entity == null) throw new KeyNotFoundException("Episode not found.");
        _repository.Remove(entity);
        var isSuccess = await _repository.SaveChangesAsync();
        if (isSuccess)
        {
            await _notificationProvider.SendInAppNotificationAsync(
                userId,
                "Episode Deleted",
                $"Your episode '{entity.Title}' was successfully deleted.",
                NotificationType.Success
            );
        }
        return isSuccess;
    }

    public async Task<EpisodeResponseDto> StitchEpisodeVideoAsync(Guid userId, Guid episodeId)
    {
        var episode = await _repository.Query()
            .Include(e => e.Show)
            .Include(e => e.Scenes.OrderBy(s => s.Order))
                .ThenInclude(s => s.AiVideo)

            .FirstOrDefaultAsync(e => e.Id == episodeId && e.Show.UserId == userId);

        if (episode == null)
            throw new KeyNotFoundException("Episode not found.");

        if (episode.Scenes == null || !episode.Scenes.Any())
            throw new InvalidOperationException("Cannot generate video for an episode with no scenes.");

        var paths = new List<string>();

        foreach (var scene in episode.Scenes)
        {
            if (scene.AiVideo != null && !string.IsNullOrWhiteSpace(scene.AiVideo.VideoUrl))
            {
                paths.Add(scene.AiVideo.VideoUrl);
            }
        }

        if (paths.Count == 0)
            throw new InvalidOperationException("Cannot generate video for an episode with no videos.");

        return await _creditManager.ExecuteWithCreditsAsync(
            userId,
            CreditActionType.GenerateVideo,
            "Episode Video Generation",
            async () =>
            {
        var seed = new Random().Next(1, 999999);
                var providerResult = await _ffmpegVideoProvider.StitchVideosAsync(paths,seed);
                var aiVideo = new AiVideo
                {
                    VideoUrl = providerResult.VideoUrl,
                    ThumbnailUrl = providerResult.ThumbnailUrl,
                    Duration = providerResult.Duration,
                    Size = providerResult.SizeInBytes,
                    Seed = seed,
                    UserId = userId,
                    AssetType = AssetType.Episode,
                    IsLinked = true
                };

                await _aiVideosRepository.AddAsync(aiVideo);

                episode.AiVideo = aiVideo;
                _repository.Update(episode);

                await _repository.SaveChangesAsync();

                await _notificationProvider.SendInAppNotificationAsync(
                    userId,
                    "Episode Video Generated",
                    $"Your video for episode '{episode.Title}' has been generated successfully.",
                    NotificationType.Success,
                    true,
                    $"User {userId} generated a new Episode Video."
                );

                return _mapper.Map<EpisodeResponseDto>(episode);
            });
    }

    public async Task<bool> ReorderScenesAsync(Guid userId, Guid episodeId, List<Guid> sceneIds)
    {
        var episode = await _repository.Query()
            .Include(e => e.Scenes)
            .FirstOrDefaultAsync(e => e.Id == episodeId && e.Show.UserId == userId);

        if (episode == null)
            throw new KeyNotFoundException("Episode not found.");

        var sceneMap = episode.Scenes.ToDictionary(s => s.Id);

        for (int i = 0; i < sceneIds.Count; i++)
        {
            var sceneId = sceneIds[i];
            if (sceneMap.TryGetValue(sceneId, out var scene))
            {
                scene.Order = i + 1;
            }
        }

        return await _repository.SaveChangesAsync();
    }
}