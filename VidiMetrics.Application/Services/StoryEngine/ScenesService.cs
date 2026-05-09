using AutoMapper;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Application.DTOs.StoryEngine.Scenes;
using VidiMetrics.Application.Interfaces.StoryEngine;
using VidiMetrics.DataAccess.Repositories.StoryEngine.Characters;
using VidiMetrics.DataAccess.Repositories.StoryEngine.Episodes;
using VidiMetrics.DataAccess.Repositories.StoryEngine.Scenes;
using VidiMetrics.DataAccess.Repositories.StoryEngine.StoryEnvironments;
using VidiMetrics.Domain.Models.StoryEngine;

namespace VidiMetrics.Application.Services.StoryEngine
{
    public class ScenesService : IScenesService
    {
        private readonly IScenesRepository _repository;
        private readonly ICharactersRepository _charactersRepository;
        private readonly IEpisodesRepository _episodesRepository;
        private readonly IStoryEnvironmentsRepository _storyEnvironmentsRepository;
        private readonly IMapper _mapper;
        private readonly IValidator<CreateSceneDto> _createValidator;
        private readonly IValidator<UpdateSceneDto> _updateValidator;

        public ScenesService(
            IScenesRepository repository,
            ICharactersRepository charactersRepository,
            IEpisodesRepository episodesRepository,
            IStoryEnvironmentsRepository storyEnvironmentsRepository,
            IMapper mapper,
            IValidator<CreateSceneDto> createValidator,
            IValidator<UpdateSceneDto> updateValidator)
        {
            _repository = repository;
            _charactersRepository = charactersRepository;
            _episodesRepository = episodesRepository;
            _storyEnvironmentsRepository = storyEnvironmentsRepository;
            _mapper = mapper;
            _createValidator = createValidator;
            _updateValidator = updateValidator;
        }

        public async Task<SceneResponseDto> GetByIdAsync(Guid id)
        {
            var entity = await _repository.Query()
                .Include(s => s.StoryEnvironment)
                .Include(s => s.SceneCharacters)
                    .ThenInclude(sc => sc.Character)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (entity == null) throw new Exception("Scene not found.");

            return _mapper.Map<SceneResponseDto>(entity);
        }

        public async Task<PaginationResponseDto<SceneResponseDto>> GetAllAsync(SceneFilterDto filter)
        {
            IQueryable<Scene> query = _repository.Query()
                .Include(s => s.StoryEnvironment)
                .Include(s => s.SceneCharacters)
                    .ThenInclude(sc => sc.Character);

            if (filter.EpisodeId.HasValue)
            {
                query = query.Where(x => x.EpisodeId == filter.EpisodeId.Value);
            }

            if (filter.StoryEnvironmentId.HasValue)
            {
                query = query.Where(x => x.StoryEnvironmentId == filter.StoryEnvironmentId.Value);
            }

            if (!string.IsNullOrWhiteSpace(filter.SearchTerm))
            {
                query = query.Where(x => x.Script.ToLower().Contains(filter.SearchTerm.ToLower()) || 
                                       x.VisualPrompt.ToLower().Contains(filter.SearchTerm.ToLower()));
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

            var paginationSource = new PaginationSource<Scene>(entities.ToList(), filter.PageNumber, filter.PageSize, totalCount);
            return _mapper.Map<PaginationResponseDto<SceneResponseDto>>(paginationSource);
        }

        public async Task<SceneResponseDto> CreateAsync(CreateSceneDto dto)
        {
            await _createValidator.ValidateAndThrowAsync(dto);

            // Validation: Show consistency
            var episode = await _episodesRepository.GetByIdAsync(dto.EpisodeId);
            if (episode == null) throw new Exception("Episode not found.");

            var environment = await _storyEnvironmentsRepository.GetByIdAsync(dto.StoryEnvironmentId);
            if (environment == null) throw new Exception("Story environment not found.");
            if (environment.ShowId != episode.ShowId) throw new Exception("Story environment must belong to the same show as the episode.");

            var entity = _mapper.Map<Scene>(dto);
            entity.CreatedAt = DateTime.UtcNow;

            if (dto.CharacterIds != null && dto.CharacterIds.Any())
            {
                var characters = await _charactersRepository.Query()
                    .Where(c => dto.CharacterIds.Contains(c.Id))
                    .ToListAsync();

                if (characters.Any(c => c.ShowId != episode.ShowId))
                    throw new Exception("All characters must belong to the same show as the episode.");

                entity.SceneCharacters = characters.Select(c => new SceneCharacter
                {
                    CharacterId = c.Id,
                    Scene = entity
                }).ToList();
            }

            await _repository.AddAsync(entity);
            await _repository.SaveChangesAsync();

            return await GetByIdAsync(entity.Id);
        }

        public async Task<SceneResponseDto> UpdateAsync(Guid id, UpdateSceneDto dto)
        {
            await _updateValidator.ValidateAndThrowAsync(dto);

            var entity = await _repository.Query()
                .Include(s => s.SceneCharacters)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (entity == null) throw new Exception("Scene not found.");

            // Validation: Show consistency
            var episode = await _episodesRepository.GetByIdAsync(entity.EpisodeId);
            
            var environment = await _storyEnvironmentsRepository.GetByIdAsync(dto.StoryEnvironmentId);
            if (environment == null) throw new Exception("Story environment not found.");
            if (environment.ShowId != episode.ShowId) throw new Exception("Story environment must belong to the same show as the episode.");

            _mapper.Map(dto, entity);
            entity.UpdatedAt = DateTime.UtcNow;

            if (dto.CharacterIds != null)
            {
                var characters = await _charactersRepository.Query()
                    .Where(c => dto.CharacterIds.Contains(c.Id))
                    .ToListAsync();

                if (characters.Any(c => c.ShowId != episode.ShowId))
                    throw new Exception("All characters must belong to the same show as the episode.");

                entity.SceneCharacters = characters.Select(c => new SceneCharacter
                {
                    CharacterId = c.Id,
                    SceneId = entity.Id
                }).ToList();
            }

            _repository.Update(entity);
            await _repository.SaveChangesAsync();

            return await GetByIdAsync(entity.Id);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("Scene not found.");

            _repository.Remove(entity);
            return await _repository.SaveChangesAsync();
        }
    }
}
