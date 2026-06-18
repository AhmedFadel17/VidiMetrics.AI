using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Application.DTOs.Core.ChannelPosts;
using VidiMetrics.Application.DTOs.Core.Channels;
using VidiMetrics.Application.Interfaces.Core;
using VidiMetrics.DataAccess.Repositories;
using VidiMetrics.DataAccess.Repositories.Core.Channels;
using VidiMetrics.DataAccess.Repositories.Core.ChannelsPosts;
using VidiMetrics.Domain.Enums.Core;
using VidiMetrics.Domain.Models.Core;
using VidiMetrics.Domain.Models.StoryEngine;

namespace VidiMetrics.Application.Services.Core
{
    public class ChannelPostsService : IChannelPostsService
    {
        private readonly IChannelPostsRepository _repository;
        private readonly IMapper _mapper;
        private readonly IValidator<CreateChannelPostDto> _createValidator;
        private readonly IValidator<UpdateChannelPostDto> _updateValidator;
        private readonly IBaseRepository<Channel> _channelRepository;
        private readonly IBaseRepository<Episode> _episodeRepository;
        private readonly IBaseRepository<Scene> _sceneRepository;

        public ChannelPostsService(
            IChannelPostsRepository repository,
            IMapper mapper,
            IValidator<CreateChannelPostDto> createValidator,
            IValidator<UpdateChannelPostDto> updateValidator,
            IBaseRepository<Channel> channelRepository,
            IBaseRepository<Episode> episodeRepository,
            IBaseRepository<Scene> sceneRepository)
        {
            _repository = repository;
            _mapper = mapper;
            _createValidator = createValidator;
            _updateValidator = updateValidator;
            _channelRepository = channelRepository;
            _episodeRepository = episodeRepository;
            _sceneRepository = sceneRepository;
        }

        public async Task<ChannelPostResponseDto> GetByIdAsync(Guid id, Guid userId)
        {
            var entity = await _repository.Query()
                .FirstOrDefaultAsync(s => s.Id == id && s.Channel.UserId == userId);
            if (entity == null) throw new Exception("Channel Post not found.");

            return _mapper.Map<ChannelPostResponseDto>(entity);
        }

        public async Task<PaginationResponseDto<ChannelPostResponseDto>> GetAllAsync(ChannelPostFilterDto filter, Guid userId)
        {
            IQueryable<ChannelPost> query = _repository.Query()
                .Include(x => x.Channel)
                .Where(x => x.Channel.UserId == userId);
            if (!filter.ChannelId.Equals(Guid.Empty))
            {
                query = query.Where(x => x.ChannelId == filter.ChannelId);
            }

            if (filter.Status.HasValue)
            {
                query = query.Where(x => x.Status == filter.Status.Value);
            }

            if (filter.SourceEntityType.HasValue)
            {
                query = query.Where(x => x.SourceEntityType == filter.SourceEntityType.Value);
            }

            if (filter.SourceEntityId.HasValue)
            {
                query = query.Where(x => x.SourceEntityId == filter.SourceEntityId.Value);
            }

            if (filter.ShowId.HasValue)
            {
                var showId = filter.ShowId.Value;
                var episodeIds = await _episodeRepository.Query()
                    .Where(e => e.ShowId == showId)
                    .Select(e => e.Id)
                    .ToListAsync();

                var sceneIds = await _sceneRepository.Query()
                    .Where(s => episodeIds.Contains(s.EpisodeId))
                    .Select(s => s.Id)
                    .ToListAsync();

                query = query.Where(x =>
                    (x.SourceEntityType == ChannelSourceEntityType.Show && x.SourceEntityId == showId) ||
                    (x.SourceEntityType == ChannelSourceEntityType.Episode && x.SourceEntityId.HasValue && episodeIds.Contains(x.SourceEntityId.Value)) ||
                    (x.SourceEntityType == ChannelSourceEntityType.Scene && x.SourceEntityId.HasValue && sceneIds.Contains(x.SourceEntityId.Value))
                );
            }

            if (!string.IsNullOrWhiteSpace(filter.SearchTerm))
            {
                query = query.Where(x => x.Channel.Name.ToLower().Contains(filter.SearchTerm.ToLower()) ||
                                       x.Description.ToLower().Contains(filter.SearchTerm.ToLower()));
            }

            var (entities, totalCount) = await _repository.GetAllWithPaginationAsync(
                query,
                filter.PageNumber,
                filter.PageSize,
                filter.OrderBy,
                filter.SortOrder,
                filter.Limit);

            var paginationSource = new PaginationSource<ChannelPost>(entities.ToList(), filter.PageNumber, filter.PageSize, totalCount);
            return _mapper.Map<PaginationResponseDto<ChannelPostResponseDto>>(paginationSource);
        }

        public async Task<ChannelPostResponseDto> CreateAsync(CreateChannelPostDto dto, Guid userId)
        {
            await _createValidator.ValidateAndThrowAsync(dto);
            var channelExist = await _channelRepository.Query()
                .AnyAsync(x => x.Id == dto.ChannelId && x.UserId == userId);
            if (!channelExist) throw new Exception("Channel not found.");

            var entity = _mapper.Map<ChannelPost>(dto);
            entity.CreatedBy = userId;
            entity.CreatedAt = DateTime.UtcNow;

            await _repository.AddAsync(entity);
            await _repository.SaveChangesAsync();

            return _mapper.Map<ChannelPostResponseDto>(entity);
        }

        public async Task<ChannelPostResponseDto> UpdateAsync(Guid id, UpdateChannelPostDto dto, Guid userId)
        {
            await _updateValidator.ValidateAndThrowAsync(dto);
            var entity = await _repository.Query()
                .FirstOrDefaultAsync(s => s.Id == id && s.Channel.UserId == userId);

            if (entity == null) throw new UnauthorizedAccessException("Invalid Channel selection or access denied.");

            _mapper.Map(dto, entity);
            entity.UpdatedAt = DateTime.UtcNow;

            _repository.Update(entity);
            await _repository.SaveChangesAsync();

            return _mapper.Map<ChannelPostResponseDto>(entity);
        }

        public async Task<bool> DeleteAsync(Guid id, Guid userId)
        {
            var entity = await _repository.Query()
                .FirstOrDefaultAsync(s => s.Id == id && s.Channel.UserId == userId);
            if (entity == null) throw new UnauthorizedAccessException("Invalid Channel selection or access denied.");

            _repository.Remove(entity);
            return await _repository.SaveChangesAsync();
        }

        public async Task<ChannelPostResponseDto> CreateDraftPostForEpisodeAsync(Guid userId, Guid channelId, Guid episodeId, DateTime? scheduledAt, CancellationToken ct = default)
        {
            var channelExist = await _channelRepository.Query()
                .AnyAsync(x => x.Id == channelId && x.UserId == userId, ct);
            if (!channelExist) throw new Exception("Channel not found or access denied.");

            var episode = await _episodeRepository.Query()
                .Include(e => e.Show)
                .Include(e => e.AiVideo)
                .FirstOrDefaultAsync(e => e.Id == episodeId && e.Show.UserId == userId, ct);

            if (episode == null) throw new Exception("Episode not found or access denied.");

            var post = new ChannelPost
            {
                Id = Guid.NewGuid(),
                Title = episode.Title,
                Description = episode.PlotSummary,
                ThumbnailUrl = episode.VideoUrl != null ? (episode.ThumbnailUrl ?? string.Empty) : string.Empty,
                VideoUrl = episode.VideoUrl ?? string.Empty,
                ScheduledAt = scheduledAt,
                ChannelId = channelId,
                Status = ChannelPostStatus.Draft,
                ContentType = ChannelContentType.EpisodeVideo,
                SourceEntityType = ChannelSourceEntityType.Episode,
                SourceEntityId = episodeId,
                IsAutoGenerated = false,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = userId,
                UpdatedAt = DateTime.UtcNow
            };

            await _repository.AddAsync(post, ct);
            await _repository.SaveChangesAsync(ct);
            return _mapper.Map<ChannelPostResponseDto>(post);
        }

        public async Task<ChannelPostResponseDto> CreateDraftPostForSceneAsync(Guid userId, Guid channelId, Guid sceneId, DateTime? scheduledAt, CancellationToken ct = default)
        {
            var channelExist = await _channelRepository.Query()
                .AnyAsync(x => x.Id == channelId && x.UserId == userId, ct);
            if (!channelExist) throw new Exception("Channel not found or access denied.");

            var scene = await _sceneRepository.Query()
                .Include(s => s.Episode)
                    .ThenInclude(e => e.Show)
                .Include(s => s.AiVideo)
                .FirstOrDefaultAsync(s => s.Id == sceneId && s.Episode.Show.UserId == userId, ct);

            if (scene == null) throw new Exception("Scene not found or access denied.");

            var post = new ChannelPost
            {
                Id = Guid.NewGuid(),
                Title = scene.Name,
                Description = $"Scene {scene.Order} from Episode: {scene.Episode.Title}",
                ThumbnailUrl = scene.AiVideo?.ThumbnailUrl ?? string.Empty,
                VideoUrl = scene.AiVideo?.VideoUrl ?? string.Empty,
                ScheduledAt = scheduledAt,
                ChannelId = channelId,
                Status = ChannelPostStatus.Draft,
                ContentType = ChannelContentType.SceneVideo,
                SourceEntityType = ChannelSourceEntityType.Scene,
                SourceEntityId = sceneId,
                IsAutoGenerated = false,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = userId,
                UpdatedAt = DateTime.UtcNow
            };

            await _repository.AddAsync(post, ct);
            await _repository.SaveChangesAsync(ct);
            return _mapper.Map<ChannelPostResponseDto>(post);
        }

        public async Task<bool> PublishPostAsync(Guid userId, Guid channelPostId, CancellationToken ct = default)
        {
            var post = await _repository.Query()
                .Include(p => p.Channel)
                .FirstOrDefaultAsync(p => p.Id == channelPostId && p.Channel.UserId == userId, ct);

            if (post == null) throw new Exception("Channel Post not found or access denied.");

            post.Status = ChannelPostStatus.Published;
            post.PublishedAt = DateTime.UtcNow;
            post.UpdatedAt = DateTime.UtcNow;

            _repository.Update(post);
            return await _repository.SaveChangesAsync(ct);
        }

        public async Task<bool> SchedulePostAsync(Guid userId, Guid channelPostId, DateTime scheduledAt, CancellationToken ct = default)
        {
            var post = await _repository.Query()
                .Include(p => p.Channel)
                .FirstOrDefaultAsync(p => p.Id == channelPostId && p.Channel.UserId == userId, ct);

            if (post == null) throw new Exception("Channel Post not found or access denied.");

            post.Status = ChannelPostStatus.Queued;
            post.ScheduledAt = scheduledAt;
            post.UpdatedAt = DateTime.UtcNow;

            _repository.Update(post);
            return await _repository.SaveChangesAsync(ct);
        }
    }
}
