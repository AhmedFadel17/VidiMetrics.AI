using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using AutoMapper;
using FluentValidation;
using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Application.DTOs.StoryEngine.Shows;
using VidiMetrics.Application.Interfaces.StoryEngine;
using VidiMetrics.DataAccess.Repositories.StoryEngine.Shows;
using VidiMetrics.Domain.Models.StoryEngine;

namespace VidiMetrics.Application.Services.StoryEngine
{
    public class ShowsService : IShowsService
    {
        private readonly IShowsRepository _repository;
        private readonly IMapper _mapper;
        private readonly IValidator<CreateShowDto> _createValidator;
        private readonly IValidator<UpdateShowDto> _updateValidator;

        public ShowsService(
            IShowsRepository repository,
            IMapper mapper,
            IValidator<CreateShowDto> createValidator,
            IValidator<UpdateShowDto> updateValidator)
        {
            _repository = repository;
            _mapper = mapper;
            _createValidator = createValidator;
            _updateValidator = updateValidator;
        }

        public async Task<ShowResponseDto> GetByIdAsync(Guid id, Guid userId, bool isAdmin = false)
        {
            var entity = await _repository.GetByIdAsync(id);


            if (entity == null)

                throw new KeyNotFoundException("Show not found.");

            if (!isAdmin && entity.CreatedBy != userId)

                throw new UnauthorizedAccessException("You are not authorized to view this show.");

            return _mapper.Map<ShowResponseDto>(entity);
        }

        public async Task<PaginationResponseDto<ShowResponseDto>> GetAllAsync(Guid userId, PaginationFilterDto filter, bool isAdmin = false)
        {
            var predicate = !isAdmin ? (Expression<Func<Show, bool>>)(x => x.CreatedBy == userId) : null;
            var (entities, totalCount) = await _repository.GetAllWithPaginationAsync(filter.PageNumber, filter.PageSize, predicate);
            var paginationSource = new PaginationSource<Show>(entities.ToList(), filter.PageNumber, filter.PageSize, totalCount);
            return _mapper.Map<PaginationResponseDto<ShowResponseDto>>(paginationSource);
        }

        public async Task<ShowResponseDto> CreateAsync(CreateShowDto dto, Guid userId, bool isAdmin = false)
        {
            await _createValidator.ValidateAndThrowAsync(dto);

            var entity = _mapper.Map<Show>(dto);
            entity.UserId = userId;
            entity.CreatedBy = userId;
            entity.CreatedAt = DateTime.UtcNow;

            await _repository.AddAsync(entity);
            await _repository.SaveChangesAsync();

            return _mapper.Map<ShowResponseDto>(entity);
        }

        public async Task<ShowResponseDto> UpdateAsync(Guid id, UpdateShowDto dto, Guid userId, bool isAdmin)
        {
            await _updateValidator.ValidateAndThrowAsync(dto);

            var entity = await _repository.GetByIdAsync(id);
            if (entity == null)
                throw new KeyNotFoundException("Show not found.");

            if (!isAdmin && entity.CreatedBy != userId)
                throw new UnauthorizedAccessException("You are not authorized to update this show.");

            _mapper.Map(dto, entity);
            entity.UpdatedAt = DateTime.UtcNow;

            _repository.Update(entity);
            await _repository.SaveChangesAsync();

            return _mapper.Map<ShowResponseDto>(entity);
        }

        public async Task<bool> DeleteAsync(Guid id, Guid userId, bool isAdmin)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null)
                throw new KeyNotFoundException("Show not found.");

            if (!isAdmin && entity.CreatedBy != userId)
                throw new UnauthorizedAccessException("You are not authorized to delete this show.");

            _repository.Remove(entity);
            return await _repository.SaveChangesAsync();
        }
    }
}