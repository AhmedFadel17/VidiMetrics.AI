using AutoMapper;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.StoryEngine.Episodes;
using VidiMetrics.Application.Interfaces.StoryEngine;
using VidiMetrics.DataAccess.Repositories.StoryEngine.Episodes;
using VidiMetrics.Domain.Models.StoryEngine;

namespace VidiMetrics.Application.Services.StoryEngine
{
    public class EpisodesService : IEpisodesService
    {
        private readonly IEpisodesRepository _repository;
        private readonly IMapper _mapper;
        private readonly IValidator<CreateEpisodeDto> _createValidator;
        private readonly IValidator<UpdateEpisodeDto> _updateValidator;

        public EpisodesService(
            IEpisodesRepository repository, 
            IMapper mapper,
            IValidator<CreateEpisodeDto> createValidator,
            IValidator<UpdateEpisodeDto> updateValidator)
        {
            _repository = repository;
            _mapper = mapper;
            _createValidator = createValidator;
            _updateValidator = updateValidator;
        }

        public async Task<EpisodeResponseDto> GetByIdAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("Episode not found.");

            return _mapper.Map<EpisodeResponseDto>(entity);
        }

        public async Task<IEnumerable<EpisodeResponseDto>> GetAllAsync()
        {
            var entities = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<EpisodeResponseDto>>(entities);
        }

        public async Task<EpisodeResponseDto> CreateAsync(CreateEpisodeDto dto)
        {
            await _createValidator.ValidateAndThrowAsync(dto);

            var entity = _mapper.Map<Episode>(dto);
            // Assuming BaseEntity has CreatedAt or similar if needed, otherwise skip
            // entity.CreatedAt = DateTime.UtcNow; 

            await _repository.AddAsync(entity);
            await _repository.SaveChangesAsync();

            return _mapper.Map<EpisodeResponseDto>(entity);
        }

        public async Task<EpisodeResponseDto> UpdateAsync(Guid id, UpdateEpisodeDto dto)
        {
            await _updateValidator.ValidateAndThrowAsync(dto);

            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("Episode not found.");

            _mapper.Map(dto, entity);

            _repository.Update(entity);
            await _repository.SaveChangesAsync();

            return _mapper.Map<EpisodeResponseDto>(entity);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("Episode not found.");

            _repository.Remove(entity);
            return await _repository.SaveChangesAsync();
        }
    }
}
