using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Application.DTOs.StoryEngine.Scenes;
using VidiMetrics.Application.Interfaces.StoryEngine;
using VidiMetrics.DataAccess.Repositories.Ai.AiScripts;
using VidiMetrics.DataAccess.Repositories.Ai.AiVideos;
using VidiMetrics.DataAccess.Repositories.StoryEngine.Characters;
using VidiMetrics.DataAccess.Repositories.StoryEngine.Episodes;
using VidiMetrics.DataAccess.Repositories.StoryEngine.Scenes;
using VidiMetrics.DataAccess.Repositories.StoryEngine.Shows;
using VidiMetrics.DataAccess.Repositories.StoryEngine.StoryEnvironments;
using VidiMetrics.Domain.Enums;
using VidiMetrics.Domain.Models.StoryEngine;

namespace VidiMetrics.Application.Services.StoryEngine
{
    public class ScenesService : IScenesService
    {
        private readonly IScenesRepository _repository;
        private readonly ICharactersRepository _charactersRepository;
        private readonly IEpisodesRepository _episodesRepository;
        private readonly IAiScriptsRepository _aiScriptsRepository;
        private readonly IAiVideosRepository _aiVideosRepository;
        private readonly IStoryEnvironmentsRepository _storyEnvironmentsRepository;
        private readonly IShowsRepository _showsRepository;
        private readonly IMapper _mapper;
        private readonly IValidator<CreateSceneDto> _createValidator;
        private readonly IValidator<UpdateSceneDto> _updateValidator;

        public ScenesService(
            IScenesRepository repository,
            ICharactersRepository charactersRepository,
            IEpisodesRepository episodesRepository,
            IAiScriptsRepository aiScriptsRepository,
            IAiVideosRepository aiVideosRepository,
            IStoryEnvironmentsRepository storyEnvironmentsRepository,
            IShowsRepository showsRepository,
            IMapper mapper,
            IValidator<CreateSceneDto> createValidator,
            IValidator<UpdateSceneDto> updateValidator)
        {
            _repository = repository;
            _charactersRepository = charactersRepository;
            _episodesRepository = episodesRepository;
            _aiScriptsRepository = aiScriptsRepository;
            _aiVideosRepository = aiVideosRepository;
            _storyEnvironmentsRepository = storyEnvironmentsRepository;
            _showsRepository = showsRepository;
            _mapper = mapper;
            _createValidator = createValidator;
            _updateValidator = updateValidator;
        }

        public async Task<SceneResponseDto> GetByIdAsync(Guid id, Guid userId)
        {
            var entity = await _repository.Query()
                .Include(s => s.AiScript)
                    .ThenInclude(x => x.StoryEnvironment)
                .Include(s => s.AiVideo)
                .Include(s => s.SceneCharacters)
                    .ThenInclude(sc => sc.Character)
                .FirstOrDefaultAsync(s => s.Id == id && s.Episode.Show.UserId == userId);

            if (entity == null) throw new Exception("Scene not found.");

            return _mapper.Map<SceneResponseDto>(entity);
        }

        public async Task<PaginationResponseDto<SceneResponseDto>> GetAllAsync(SceneFilterDto filter, Guid userId)
        {
            IQueryable<Scene> query = _repository.Query()
                .Include(s => s.AiScript)
                    .ThenInclude(x => x.StoryEnvironment)
                .Include(s => s.AiVideo)
                .Include(s => s.SceneCharacters)
                    .ThenInclude(sc => sc.Character);

            query = query.Where(x => x.Episode.Show.UserId == userId);

            if (filter.EpisodeId.HasValue)
            {
                query = query.Where(x => x.EpisodeId == filter.EpisodeId.Value);
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

        public async Task<SceneResponseDto> CreateAsync(CreateSceneDto dto, Guid userId)
        {
            await _createValidator.ValidateAndThrowAsync(dto);

            // Validation: Show consistency and Authority
            var episode = await _episodesRepository.Query()
                .Include(e => e.Show)
                .FirstOrDefaultAsync(e => e.Id == dto.EpisodeId && e.Show.UserId == userId);


            if (episode == null) throw new Exception("Episode not found or access denied.");

            var script = await _aiScriptsRepository.Query()
                .FirstOrDefaultAsync(e => e.Id == dto.AiScriptId && e.UserId == userId);


            if (script == null) throw new Exception("Script not found or access denied.");
            script.IsLinked = true;
            _aiScriptsRepository.Update(script);

            var video = await _aiVideosRepository.Query()
                .FirstOrDefaultAsync(e => e.Id == dto.AiVideoId && e.UserId == userId);


            if (video == null) throw new Exception("Video not found or access denied.");
            video.IsLinked = true;
            video.AssetType = AssetType.Scene;
            _aiVideosRepository.Update(video);

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

            return await GetByIdAsync(entity.Id, userId);
        }

        public async Task<SceneResponseDto> UpdateAsync(Guid id, UpdateSceneDto dto, Guid userId)
        {
            await _updateValidator.ValidateAndThrowAsync(dto);

            var entity = await _repository.Query()
                .Include(s => s.SceneCharacters)
                .FirstOrDefaultAsync(s => s.Id == id && s.Episode.Show.UserId == userId);

            if (entity == null) throw new Exception("Scene not found.");

            // Validation: Show consistency
            var episode = await _episodesRepository.Query()
                .FirstOrDefaultAsync(e => e.Id == entity.EpisodeId);
            if (episode == null) throw new Exception("Episode not found.");

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

            return await GetByIdAsync(entity.Id, userId);
        }

        public async Task<bool> DeleteAsync(Guid id, Guid userId)
        {
            var entity = await _repository.Query()
                .FirstOrDefaultAsync(s => s.Id == id && s.Episode.Show.UserId == userId);
            if (entity == null) throw new Exception("Scene not found.");

            _repository.Remove(entity);
            return await _repository.SaveChangesAsync();
        }
    }
}
