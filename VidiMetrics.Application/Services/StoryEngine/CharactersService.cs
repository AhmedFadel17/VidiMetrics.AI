using AutoMapper;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Application.DTOs.StoryEngine.Characters;
using VidiMetrics.Application.Interfaces.StoryEngine;
using VidiMetrics.DataAccess.Repositories.StoryEngine.Characters;
using VidiMetrics.Domain.Models.StoryEngine;

namespace VidiMetrics.Application.Services.StoryEngine
{
    public class CharactersService : ICharactersService
    {
        private readonly ICharactersRepository _repository;
        private readonly IMapper _mapper;
        private readonly IValidator<CreateCharacterDto> _createValidator;
        private readonly IValidator<UpdateCharacterDto> _updateValidator;

        public CharactersService(
            ICharactersRepository repository, 
            IMapper mapper,
            IValidator<CreateCharacterDto> createValidator,
            IValidator<UpdateCharacterDto> updateValidator)
        {
            _repository = repository;
            _mapper = mapper;
            _createValidator = createValidator;
            _updateValidator = updateValidator;
        }

        public async Task<CharacterResponseDto> GetByIdAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("Character not found.");

            return _mapper.Map<CharacterResponseDto>(entity);
        }

        public async Task<PaginationResponseDto<CharacterResponseDto>> GetAllAsync(CharacterFilterDto filter)
        {
            var query = _repository.Query();

            if (filter.ShowId.HasValue)
            {
                query = query.Where(x => x.ShowId == filter.ShowId.Value);
            }

            if (!string.IsNullOrWhiteSpace(filter.SearchTerm))
            {
                query = query.Where(x => x.Name.ToLower().Contains(filter.SearchTerm.ToLower()) || 
                                       x.Role.ToLower().Contains(filter.SearchTerm.ToLower()) ||
                                       x.PersonalityTraits.ToLower().Contains(filter.SearchTerm.ToLower()));
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

            var paginationSource = new PaginationSource<Character>(entities.ToList(), filter.PageNumber, filter.PageSize, totalCount);
            return _mapper.Map<PaginationResponseDto<CharacterResponseDto>>(paginationSource);
        }

        public async Task<CharacterResponseDto> CreateAsync(CreateCharacterDto dto)
        {
            await _createValidator.ValidateAndThrowAsync(dto);

            var entity = _mapper.Map<Character>(dto);
            entity.CreatedAt = DateTime.UtcNow;

            await _repository.AddAsync(entity);
            await _repository.SaveChangesAsync();

            return _mapper.Map<CharacterResponseDto>(entity);
        }

        public async Task<CharacterResponseDto> UpdateAsync(Guid id, UpdateCharacterDto dto)
        {
            await _updateValidator.ValidateAndThrowAsync(dto);

            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("Character not found.");

            _mapper.Map(dto, entity);
            entity.UpdatedAt = DateTime.UtcNow;

            _repository.Update(entity);
            await _repository.SaveChangesAsync();

            return _mapper.Map<CharacterResponseDto>(entity);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("Character not found.");

            _repository.Remove(entity);
            return await _repository.SaveChangesAsync();
        }
    }
}
