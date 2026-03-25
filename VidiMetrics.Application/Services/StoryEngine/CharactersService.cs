using AutoMapper;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
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

        public async Task<IEnumerable<CharacterResponseDto>> GetAllAsync()
        {
            var entities = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<CharacterResponseDto>>(entities);
        }

        public async Task<CharacterResponseDto> CreateAsync(CreateCharacterDto dto)
        {
            await _createValidator.ValidateAndThrowAsync(dto);

            var entity = _mapper.Map<Character>(dto);
            // Assuming BaseEntity has CreatedAt or similar if needed, otherwise skip
            // entity.CreatedAt = DateTime.UtcNow; 

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
