using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Application.DTOs.StoryEngine.Episodes;
using VidiMetrics.Application.Interfaces.StoryEngine;
using VidiMetrics.DataAccess.Repositories.StoryEngine.Episodes;
using VidiMetrics.DataAccess.Repositories.StoryEngine.Shows;
using VidiMetrics.Domain.Models.StoryEngine;

namespace VidiMetrics.Application.Services.StoryEngine
{
    public class EpisodesService : IEpisodesService
    {
        private readonly IEpisodesRepository _repository;
        private readonly IShowsRepository _showsRepository;
        private readonly IMapper _mapper;
        private readonly IValidator<CreateEpisodeDto> _createValidator;
        private readonly IValidator<UpdateEpisodeDto> _updateValidator;

        public EpisodesService(
            IEpisodesRepository repository,

            IShowsRepository showsRepository,
            IMapper mapper,
            IValidator<CreateEpisodeDto> createValidator,
            IValidator<UpdateEpisodeDto> updateValidator)
        {
            _repository = repository;
            _showsRepository = showsRepository;
            _mapper = mapper;
            _createValidator = createValidator;
            _updateValidator = updateValidator;
        }

        public async Task<EpisodeResponseDto> GetByIdAsync(Guid id, Guid userId)
        {
            var entity = await _repository.Query()
                .FirstOrDefaultAsync(e => e.Id == id && e.Show.UserId == userId);
            if (entity == null) throw new Exception("Episode not found.");

            return _mapper.Map<EpisodeResponseDto>(entity);
        }

        public async Task<PaginationResponseDto<EpisodeResponseDto>> GetAllAsync(EpisodeFilterDto filter, Guid userId)
        {
            var query = _repository.Query();

            query = query.Where(x => x.Show.UserId == userId);

            if (filter.ShowId.HasValue)
            {
                query = query.Where(x => x.ShowId == filter.ShowId.Value);
            }

            if (!string.IsNullOrWhiteSpace(filter.SearchTerm))
            {
                query = query.Where(x => x.Title.ToLower().Contains(filter.SearchTerm.ToLower()) ||

                                       x.PlotSummary.ToLower().Contains(filter.SearchTerm.ToLower()));
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

            var paginationSource = new PaginationSource<Episode>(entities.ToList(), filter.PageNumber, filter.PageSize, totalCount);
            return _mapper.Map<PaginationResponseDto<EpisodeResponseDto>>(paginationSource);
        }

        public async Task<EpisodeResponseDto> CreateAsync(CreateEpisodeDto dto, Guid userId)
        {
            await _createValidator.ValidateAndThrowAsync(dto);

            var show = await _showsRepository.Query()
                .FirstOrDefaultAsync(s => s.Id == dto.ShowId && s.UserId == userId);

            if (show == null) throw new UnauthorizedAccessException("Invalid Show selection or access denied.");
            if (dto.EpisodeNumber != show.TotalEpisodes + 1) throw new Exception("Invalid Episode Number");

            var entity = _mapper.Map<Episode>(dto);
            entity.CreatedAt = DateTime.UtcNow;

            await _repository.AddAsync(entity);
            await _repository.SaveChangesAsync();

            return _mapper.Map<EpisodeResponseDto>(entity);
        }

        public async Task<EpisodeResponseDto> UpdateAsync(Guid id, UpdateEpisodeDto dto, Guid userId)
        {
            await _updateValidator.ValidateAndThrowAsync(dto);

            var entity = await _repository.Query()
                .FirstOrDefaultAsync(x => x.Id == id && x.Show.UserId == userId);
            if (entity == null) throw new Exception("Episode not found.");

            _mapper.Map(dto, entity);
            entity.UpdatedAt = DateTime.UtcNow;

            _repository.Update(entity);
            await _repository.SaveChangesAsync();

            return _mapper.Map<EpisodeResponseDto>(entity);
        }

        public async Task<bool> DeleteAsync(Guid id, Guid userId)
        {
            var entity = await _repository.Query()
                .FirstOrDefaultAsync(x => x.Id == id && x.Show.UserId == userId);
            if (entity == null) throw new Exception("Episode not found.");

            _repository.Remove(entity);
            return await _repository.SaveChangesAsync();
        }
    }
}
