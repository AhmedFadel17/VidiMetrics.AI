using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Application.DTOs.StoryEngine.Shows;
using VidiMetrics.Application.DTOs.StoryEngine.Stats;
using VidiMetrics.Application.Interfaces.StoryEngine;
using VidiMetrics.Application.Providers.NotificationsProviders;
using VidiMetrics.DataAccess.Repositories.Ai.AiImages;
using VidiMetrics.DataAccess.Repositories.StoryEngine.Shows;
using VidiMetrics.Domain.Enums.Ai;
using VidiMetrics.Domain.Enums.Infra;
using VidiMetrics.Domain.Models.Ai;
using VidiMetrics.Domain.Models.StoryEngine;

namespace VidiMetrics.Application.Services.StoryEngine;

public class ShowsService : IShowsService
{
    private readonly IShowsRepository _repository;
    private readonly IMapper _mapper;
    private readonly IAiImagesRepository _imagesRepository;
    private readonly IValidator<CreateShowDto> _createValidator;
    private readonly IValidator<UpdateShowDto> _updateValidator;
    private readonly INotificationProvider _notificationProvider;

    public ShowsService(
        IShowsRepository repository,
        IMapper mapper,
        IAiImagesRepository imagesRepository,
        IValidator<CreateShowDto> createValidator,
        IValidator<UpdateShowDto> updateValidator,
        INotificationProvider notificationProvider)
    {
        _repository = repository;
        _mapper = mapper;
        _imagesRepository = imagesRepository;
        _createValidator = createValidator;
        _updateValidator = updateValidator;
        _notificationProvider = notificationProvider;
    }

    public async Task<ShowResponseDto> GetByIdAsync(Guid userId, Guid id, CancellationToken ct = default)
    {
        var entity = await _repository.Query().Include(x => x.AiImage).FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);
        if (entity == null)
            throw new KeyNotFoundException("Show not found.");
        return _mapper.Map<ShowResponseDto>(entity);
    }

    public async Task<ShowResponseDto> GetWithDetailsByIdAsync(Guid userId, Guid id, CancellationToken ct = default)
    {
        var entity = await _repository.Query()
            .Include(x => x.AiImage)
            .Include(x => x.Episodes)
            .FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);
        if (entity == null)
            throw new KeyNotFoundException("Show not found.");
        return _mapper.Map<ShowResponseDto>(entity);
    }

    public async Task<PaginationResponseDto<ShowResponseDto>> GetAllAsync(Guid userId, ShowFilterDto filter, CancellationToken ct = default)
    {
        IQueryable<Show> query = _repository.Query().Include(x => x.AiImage).Where(x => x.UserId == userId);
        if (!string.IsNullOrWhiteSpace(filter.SearchTerm))
        {
            query = query.Where(x => x.Title.ToLower().Contains(filter.SearchTerm.ToLower()) || x.Description.ToLower().Contains(filter.SearchTerm.ToLower()));
        }
        if (filter.Status.HasValue)
        {
            query = query.Where(x => x.Status == filter.Status.Value);
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
        var paginationSource = new PaginationSource<Show>(entities.ToList(), filter.PageNumber, filter.PageSize, totalCount);
        return _mapper.Map<PaginationResponseDto<ShowResponseDto>>(paginationSource);
    }

    public async Task<ShowResponseDto> CreateAsync(Guid userId, CreateShowDto dto)
    {
        await _createValidator.ValidateAndThrowAsync(dto);
        var image = await _imagesRepository.Query().FirstOrDefaultAsync(s => s.Id == dto.AiImageId && s.UserId == userId);
        if (image == null)

            throw new UnauthorizedAccessException("Invalid Image selection or access denied.");
        image.IsLinked = true;
        _imagesRepository.Update(image);
        var entity = _mapper.Map<Show>(dto);
        entity.UserId = userId;
        entity.CreatedBy = userId;
        entity.CreatedAt = DateTime.UtcNow;
        await _repository.AddAsync(entity);
        await _repository.SaveChangesAsync();
        await _notificationProvider.SendInAppNotificationAsync(
            userId,
            "Show Created",
            $"Your show '{entity.Title}' has been created successfully.",
            NotificationType.Success,
            true,
            $"User {userId} created a new show titled '{entity.Title}'."
        );
        return _mapper.Map<ShowResponseDto>(entity);
    }

    public async Task<ShowResponseDto> UpdateAsync(Guid userId, Guid id, UpdateShowDto dto)
    {
        await _updateValidator.ValidateAndThrowAsync(dto);
        var entity = await _repository.Query().FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);
        if (entity == null)
            throw new KeyNotFoundException("Show not found.");
        _mapper.Map(dto, entity);
        entity.UpdatedAt = DateTime.UtcNow;
        _repository.Update(entity);
        await _repository.SaveChangesAsync();
        return _mapper.Map<ShowResponseDto>(entity);
    }

    public async Task<bool> DeleteAsync(Guid userId, Guid id)
    {
        var entity = await _repository.Query().FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);
        if (entity == null)
            throw new KeyNotFoundException("Show not found.");
        _repository.Remove(entity);
        var isSuccess = await _repository.SaveChangesAsync();
        if (isSuccess)
        {
            Guid targetUser = entity.CreatedBy ?? userId;
            await _notificationProvider.SendInAppNotificationAsync(
                targetUser,
                "Show Deleted",
                $"Your show '{entity.Title}' was successfully deleted.",
                NotificationType.Success
            );
        }
        return isSuccess;
    }

    public async Task<StoryEngineStatsResponseDto> GetStatsAsync(Guid userId, bool isAdmin, CancellationToken ct = default)
    {
        var showsQuery = _repository.Query();
        if (!isAdmin)
        {
            showsQuery = showsQuery.Where(x => x.UserId == userId);
        }

        var stats = await showsQuery
            .Select(show => new
            {
                EpisodesCount = show.Episodes.Count,
                ScenesCount = show.Episodes.SelectMany(e => e.Scenes).Count(),
                CharactersCount = show.Characters.Count,
                LocationsCount = show.Locations.Count
            })
            .ToListAsync(ct);

        return new StoryEngineStatsResponseDto
        {
            TotalShows = stats.Count,
            TotalEpisodes = stats.Sum(x => x.EpisodesCount),
            TotalScenes = stats.Sum(x => x.ScenesCount),
            TotalCharacters = stats.Sum(x => x.CharactersCount),
            TotalLocations = stats.Sum(x => x.LocationsCount)
        };
    }
}