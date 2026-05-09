using AutoMapper;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Application.DTOs.StoryEngine.StoryEnvironments;
using VidiMetrics.Application.Interfaces.StoryEngine;
using VidiMetrics.DataAccess.Repositories.StoryEngine.StoryEnvironments;
using VidiMetrics.Domain.Models.StoryEngine;

namespace VidiMetrics.Application.Services.StoryEngine
{
    public class StoryEnvironmentsService : IStoryEnvironmentsService
    {
        private readonly IStoryEnvironmentsRepository _repository;
        private readonly IMapper _mapper;
        private readonly IValidator<CreateStoryEnvironmentDto> _createValidator;
        private readonly IValidator<UpdateStoryEnvironmentDto> _updateValidator;

        public StoryEnvironmentsService(
            IStoryEnvironmentsRepository repository, 
            IMapper mapper,
            IValidator<CreateStoryEnvironmentDto> createValidator,
            IValidator<UpdateStoryEnvironmentDto> updateValidator)
        {
            _repository = repository;
            _mapper = mapper;
            _createValidator = createValidator;
            _updateValidator = updateValidator;
        }

        public async Task<StoryEnvironmentResponseDto> GetByIdAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("StoryEnvironment not found.");

            return _mapper.Map<StoryEnvironmentResponseDto>(entity);
        }

        public async Task<PaginationResponseDto<StoryEnvironmentResponseDto>> GetAllAsync(StoryEnvironmentFilterDto filter)
        {
            var query = _repository.Query();

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

        public async Task<StoryEnvironmentResponseDto> CreateAsync(CreateStoryEnvironmentDto dto)
        {
            await _createValidator.ValidateAndThrowAsync(dto);

            var entity = _mapper.Map<StoryEnvironment>(dto);
            entity.CreatedAt = DateTime.UtcNow;

            await _repository.AddAsync(entity);
            await _repository.SaveChangesAsync();

            return _mapper.Map<StoryEnvironmentResponseDto>(entity);
        }

        public async Task<StoryEnvironmentResponseDto> UpdateAsync(Guid id, UpdateStoryEnvironmentDto dto)
        {
            await _updateValidator.ValidateAndThrowAsync(dto);

            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("StoryEnvironment not found.");

            _mapper.Map(dto, entity);
            entity.UpdatedAt = DateTime.UtcNow;

            _repository.Update(entity);
            await _repository.SaveChangesAsync();

            return _mapper.Map<StoryEnvironmentResponseDto>(entity);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("StoryEnvironment not found.");

            _repository.Remove(entity);
            return await _repository.SaveChangesAsync();
        }
    }
}
