using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Application.DTOs.StoryEngine.Locations;
using VidiMetrics.Application.Interfaces.StoryEngine;
using VidiMetrics.Application.Providers.NotificationsProviders;
using VidiMetrics.DataAccess.Repositories.Ai.AiImages;
using VidiMetrics.DataAccess.Repositories.StoryEngine.Locations;
using VidiMetrics.DataAccess.Repositories.StoryEngine.Shows;
using VidiMetrics.Domain.Enums.Ai;
using VidiMetrics.Domain.Enums.Infra;
using VidiMetrics.Domain.Models.StoryEngine;

namespace VidiMetrics.Application.Services.StoryEngine;

public class LocationsService : ILocationsService
{
    private readonly ILocationsRepository _repository;
    private readonly IShowsRepository _showsRepository;
    private readonly IAiImagesRepository _imagesRepository;
    private readonly IMapper _mapper;
    private readonly IValidator<CreateLocationDto> _createValidator;
    private readonly IValidator<UpdateLocationDto> _updateValidator;
    private readonly INotificationProvider _notificationProvider;

    public LocationsService(
        ILocationsRepository repository,
        IShowsRepository showsRepository,
        IAiImagesRepository imagesRepository,
        IMapper mapper,
        IValidator<CreateLocationDto> createValidator,
        IValidator<UpdateLocationDto> updateValidator,
        INotificationProvider notificationProvider)
    {
        _repository = repository;
        _showsRepository = showsRepository;
        _imagesRepository = imagesRepository;
        _mapper = mapper;
        _createValidator = createValidator;
        _updateValidator = updateValidator;
        _notificationProvider = notificationProvider;
    }

    public async Task<LocationResponseDto> GetByIdAsync(Guid userId, Guid id, CancellationToken ct = default)
    {
        var entity = await _repository.Query()
            .Include(x => x.AiImage)
            .FirstOrDefaultAsync(e => e.Id == id && e.Show.UserId == userId, cancellationToken: ct);
        if (entity == null) throw new KeyNotFoundException("Location not found.");
        return _mapper.Map<LocationResponseDto>(entity);
    }

    public async Task<PaginationResponseDto<LocationResponseDto>> GetAllAsync(Guid userId, LocationFilterDto filter, CancellationToken ct = default)
    {
        IQueryable<Location> query = _repository.Query().Include(x => x.AiImage);
        query = query.Where(x => x.Show.UserId == userId);
        if (filter.ShowId.HasValue)
        {
            query = query.Where(x => x.ShowId == filter.ShowId.Value);
        }
        if (!string.IsNullOrWhiteSpace(filter.SearchTerm))
        {
            query = query.Where(x => x.Name.ToLower().Contains(filter.SearchTerm.ToLower()) ||
                                   x.VisualDescription.ToLower().Contains(filter.SearchTerm.ToLower()) ||
                                   x.Atmosphere.ToLower().Contains(filter.SearchTerm.ToLower()));
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
        var paginationSource = new PaginationSource<Location>(entities.ToList(), filter.PageNumber, filter.PageSize, totalCount);
        return _mapper.Map<PaginationResponseDto<LocationResponseDto>>(paginationSource);
    }

    public async Task<IEnumerable<LookupDto>> GetLookupAsync(Guid userId, Guid? showId = null, CancellationToken ct = default)
    {
        IQueryable<Location> query = _repository.Query().Include(x => x.AiImage);
        query = query.Where(x => x.Show.UserId == userId);
        if (showId.HasValue)
        {
            query = query.Where(x => x.ShowId == showId.Value);
        }
        return await query
            .OrderBy(x => x.Name)
            .Select(x => new LookupDto
            {
                Id = x.Id,
                Name = x.Name,
                ImageUrl = x.ReferenceImageUrl
            })
            .ToListAsync(cancellationToken: ct);
    }

    public async Task<LocationResponseDto> CreateAsync(Guid userId, CreateLocationDto dto)
    {
        await _createValidator.ValidateAndThrowAsync(dto);
        var showExists = await _showsRepository.Query().AnyAsync(s => s.Id == dto.ShowId && s.UserId == userId);
        if (!showExists) throw new UnauthorizedAccessException("Invalid Show selection or access denied.");
        var image = await _imagesRepository.Query().FirstOrDefaultAsync(s => s.Id == dto.AiImageId && s.UserId == userId);
        if (image == null) throw new UnauthorizedAccessException("Invalid Image selection or access denied.");
        image.IsLinked = true;
        _imagesRepository.Update(image);
        await _imagesRepository.SaveChangesAsync();
        var entity = _mapper.Map<Location>(dto);
        entity.CreatedAt = DateTime.UtcNow;
        await _repository.AddAsync(entity);
        await _repository.SaveChangesAsync();
        await _notificationProvider.SendInAppNotificationAsync(
            userId,
            "Location Created",
            $"Your location '{entity.Name}' has been created successfully.",
            NotificationType.Success,
            true,
            $"User {userId} created a new location named '{entity.Name}'."
        );
        return _mapper.Map<LocationResponseDto>(entity);
    }

    public async Task<LocationResponseDto> UpdateAsync(Guid userId, Guid id, UpdateLocationDto dto)
    {
        await _updateValidator.ValidateAndThrowAsync(dto);
        var entity = await _repository.Query().FirstOrDefaultAsync(x => x.Id == id && x.Show.UserId == userId);
        if (entity == null) throw new KeyNotFoundException("Location not found.");
        _mapper.Map(dto, entity);
        entity.UpdatedAt = DateTime.UtcNow;
        _repository.Update(entity);
        await _repository.SaveChangesAsync();
        return _mapper.Map<LocationResponseDto>(entity);
    }

    public async Task<bool> DeleteAsync(Guid userId, Guid id)
    {
        var entity = await _repository.Query().FirstOrDefaultAsync(x => x.Id == id && x.Show.UserId == userId);
        if (entity == null) throw new KeyNotFoundException("Location not found.");
        _repository.Remove(entity);
        var isSuccess = await _repository.SaveChangesAsync();
        if (isSuccess)
        {
            await _notificationProvider.SendInAppNotificationAsync(
                userId,
                "Location Deleted",
                $"Your location '{entity.Name}' was successfully deleted.",
                NotificationType.Success
            );
        }
        return isSuccess;
    }
}