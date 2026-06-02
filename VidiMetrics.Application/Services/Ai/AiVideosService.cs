using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using VidiMetrics.Application.DTOs.Ai.AiVideos;
using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Application.Interfaces.Ai;
using VidiMetrics.Application.Providers.VideoProviders;
using VidiMetrics.DataAccess.Repositories.Ai.AiScripts;
using VidiMetrics.DataAccess.Repositories.Ai.AiVideos;
using VidiMetrics.Domain.Enums;
using VidiMetrics.Domain.Models.Ai;

namespace VidiMetrics.Application.Services.Ai
{
    public class AiVideosService : IAiVideosService
    {
        private readonly IMapper _mapper;
        private readonly IAiVideosRepository _repo;
        private readonly IAiScriptsRepository _aiScriptsRepository;
        private readonly IVideoProvider _videoProvider;
        private readonly IValidator<UpdateAiVideoDto> _updateValidator;
        private readonly IValidator<CreateSceneVideoDto> _createValidator;

        public AiVideosService(
            IMapper mapper,
            IAiVideosRepository repo,
            IAiScriptsRepository aiScriptsRepository,
            IVideoProvider videoProvider,
            IValidator<UpdateAiVideoDto> updateValidator,
            IValidator<CreateSceneVideoDto> createValidator)
        {
            _mapper = mapper;
            _repo = repo;
            _aiScriptsRepository = aiScriptsRepository;
            _videoProvider = videoProvider;
            _updateValidator = updateValidator;
            _createValidator = createValidator;
        }

        public async Task<AiVideoResponseDto> CreateSceneVideoAsync(CreateSceneVideoDto dto, Guid userId)
        {
            await _createValidator.ValidateAndThrowAsync(dto);

            var script = await _aiScriptsRepository.Query()
                .FirstOrDefaultAsync(e => e.Id == dto.ScriptId && e.UserId == userId);

            if (script == null) throw new Exception("Script not found or access denied.");

            var seed = new Random().Next(1, 999999);
            VideoGenerationResult providerResult = await _videoProvider.GenerateVideoAsync(script.VisualPrompt, seed);
            var video = new AiVideo
            {
                VideoUrl = providerResult.VideoUrl,
                ThumbnailUrl = providerResult.ThumbnailUrl,
                Duration = providerResult.Duration,
                Size = providerResult.SizeInBytes,
                Seed = seed,
                UserId = userId,
            };

            await _repo.AddAsync(video);
            await _repo.SaveChangesAsync();

            return _mapper.Map<AiVideoResponseDto>(video);
        }

        public async Task<bool> DeleteAsync(Guid id, Guid userId)
        {
            var entity = await _repo.Query()
                .FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);
            if (entity == null) throw new Exception("Video not found.");

            _repo.Remove(entity);
            return await _repo.SaveChangesAsync();
        }

        public async Task<PaginationResponseDto<AiVideoResponseDto>> GetAllAsync(AiVideoFilterDto filter, Guid userId)
        {
            IQueryable<AiVideo> query = _repo.Query();
            query = query.Where(x => x.UserId == userId);
            if (filter.AssetType.HasValue)
            {
                if (filter.AssetType.Value == AssetType.Unlinked)
                {
                    query = query.Where(x => !x.IsLinked);
                }
                else
                {
                    query = query.Where(x => x.AssetType == filter.AssetType.Value);
                }
            }
            var (entities, totalCount) = await _repo.GetAllWithPaginationAsync(
                query,
                filter.PageNumber,
                filter.PageSize,
                filter.OrderBy,
                filter.SortOrder,
                filter.Limit);

            var paginationSource = new PaginationSource<AiVideo>(entities.ToList(), filter.PageNumber, filter.PageSize, totalCount);
            return _mapper.Map<PaginationResponseDto<AiVideoResponseDto>>(paginationSource);
        }

        public async Task<AiVideoResponseDto> GetByIdAsync(Guid id, Guid userId)
        {
            var entity = await _repo.Query()
                .FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId);
            if (entity == null) throw new Exception("Video not found.");
            return _mapper.Map<AiVideoResponseDto>(entity);
        }

        public async Task<AiVideoResponseDto> UpdateAsync(Guid id, UpdateAiVideoDto dto, Guid userId)
        {
            await _updateValidator.ValidateAndThrowAsync(dto);
            var entity = await _repo.Query()
                .FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);
            if (entity == null) throw new Exception("Video not found.");

            _mapper.Map(dto, entity);
            entity.UpdatedAt = DateTime.UtcNow;

            _repo.Update(entity);
            await _repo.SaveChangesAsync();

            return _mapper.Map<AiVideoResponseDto>(entity);
        }
    }
}
