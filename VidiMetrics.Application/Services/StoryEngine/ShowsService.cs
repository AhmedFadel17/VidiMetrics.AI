using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using FluentValidation;
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

        public async Task<ShowResponseDto> GetByIdAsync(Guid id, Guid userId, bool isAdmin)
        {
            var entity = await _repository.GetByIdAsync(id);


            if (entity == null)

                throw new KeyNotFoundException("Show not found.");

            if (!isAdmin && entity.CreatedBy != userId)

                throw new UnauthorizedAccessException("You are not authorized to view this show.");

            return _mapper.Map<ShowResponseDto>(entity);
        }

        public async Task<IEnumerable<ShowResponseDto>> GetAllAsync(Guid userId, bool isAdmin)
        {
            var entities = await _repository.GetAllAsync();

            if (!isAdmin)
            {
                entities = entities.Where(x => x.CreatedBy == userId);
            }

            return _mapper.Map<IEnumerable<ShowResponseDto>>(entities);
        }

        public async Task<ShowResponseDto> CreateAsync(CreateShowDto dto, Guid userId)
        {
            await _createValidator.ValidateAndThrowAsync(dto);

            var entity = _mapper.Map<Show>(dto);
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