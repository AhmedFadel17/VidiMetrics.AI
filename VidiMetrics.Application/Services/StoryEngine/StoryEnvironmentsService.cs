using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Application.DTOs.StoryEngine.StoryEnvironments;
using VidiMetrics.Application.Interfaces.StoryEngine;
using VidiMetrics.DataAccess.Repositories.Ai.AiImages;
using VidiMetrics.DataAccess.Repositories.StoryEngine.Shows;
using VidiMetrics.DataAccess.Repositories.StoryEngine.StoryEnvironments;
using VidiMetrics.Domain.Enums;
using VidiMetrics.Domain.Models.StoryEngine;

namespace VidiMetrics.Application.Services.StoryEngine
{
    public class StoryEnvironmentsService : IStoryEnvironmentsService
    {
        private readonly IStoryEnvironmentsRepository _repository;
        private readonly IShowsRepository _showsRepository;
        private readonly IAiImagesRepository _imagesRepository;
        private readonly IMapper _mapper;
        private readonly IValidator<CreateStoryEnvironmentDto> _createValidator;
        private readonly IValidator<UpdateStoryEnvironmentDto> _updateValidator;

        public StoryEnvironmentsService(
            IStoryEnvironmentsRepository repository,

            IShowsRepository showsRepository,
            IAiImagesRepository imagesRepository,
            IMapper mapper,
            IValidator<CreateStoryEnvironmentDto> createValidator,
            IValidator<UpdateStoryEnvironmentDto> updateValidator)
        {
            _repository = repository;
            _showsRepository = showsRepository;
            _imagesRepository = imagesRepository;
            _mapper = mapper;
            _createValidator = createValidator;
            _updateValidator = updateValidator;
        }

        public async Task<StoryEnvironmentResponseDto> GetByIdAsync(Guid id, Guid userId)
        {
            var entity = await _repository.Query()
                .Include(x => x.AiImage)
                .FirstOrDefaultAsync(e => e.Id == id && e.Show.UserId == userId);
            if (entity == null) throw new Exception("StoryEnvironment not found.");

            return _mapper.Map<StoryEnvironmentResponseDto>(entity);
        }

        public async Task<PaginationResponseDto<StoryEnvironmentResponseDto>> GetAllAsync(StoryEnvironmentFilterDto filter, Guid userId)
        {
            IQueryable<StoryEnvironment> query = _repository.Query()
                .Include(x => x.AiImage);

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
                filter.Limit);

            var paginationSource = new PaginationSource<StoryEnvironment>(entities.ToList(), filter.PageNumber, filter.PageSize, totalCount);
            return _mapper.Map<PaginationResponseDto<StoryEnvironmentResponseDto>>(paginationSource);
        }

        public async Task<IEnumerable<LookupDto>> GetLookupAsync(Guid userId, Guid? showId = null)
        {
            IQueryable<StoryEnvironment> query = _repository.Query()
            .Include(x => x.AiImage);

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
                .ToListAsync();
        }

        public async Task<StoryEnvironmentResponseDto> CreateAsync(CreateStoryEnvironmentDto dto, Guid userId)
        {
            await _createValidator.ValidateAndThrowAsync(dto);

            var showExists = await _showsRepository.Query()
                .AnyAsync(s => s.Id == dto.ShowId && s.UserId == userId);

            if (!showExists) throw new UnauthorizedAccessException("Invalid Show selection or access denied.");

            var image = await _imagesRepository.Query()
                                        .FirstOrDefaultAsync(s => s.Id == dto.AiImageId && s.UserId == userId);
            if (image == null) throw new UnauthorizedAccessException("Invalid Image selection or access denied.");
            image.AssetType = AssetType.Environment;
            _imagesRepository.Update(image);
            await _imagesRepository.SaveChangesAsync();

            var entity = _mapper.Map<StoryEnvironment>(dto);
            entity.CreatedAt = DateTime.UtcNow;

            await _repository.AddAsync(entity);
            await _repository.SaveChangesAsync();

            return _mapper.Map<StoryEnvironmentResponseDto>(entity);
        }

        public async Task<StoryEnvironmentResponseDto> UpdateAsync(Guid id, UpdateStoryEnvironmentDto dto, Guid userId)
        {
            await _updateValidator.ValidateAndThrowAsync(dto);

            var entity = await _repository.Query()
                .FirstOrDefaultAsync(x => x.Id == id && x.Show.UserId == userId);
            if (entity == null) throw new Exception("StoryEnvironment not found.");

            _mapper.Map(dto, entity);
            entity.UpdatedAt = DateTime.UtcNow;

            _repository.Update(entity);
            await _repository.SaveChangesAsync();

            return _mapper.Map<StoryEnvironmentResponseDto>(entity);
        }

        public async Task<bool> DeleteAsync(Guid id, Guid userId)
        {
            var entity = await _repository.Query()
                .FirstOrDefaultAsync(x => x.Id == id && x.Show.UserId == userId);
            if (entity == null) throw new Exception("StoryEnvironment not found.");

            _repository.Remove(entity);
            return await _repository.SaveChangesAsync();
        }
    }
}
