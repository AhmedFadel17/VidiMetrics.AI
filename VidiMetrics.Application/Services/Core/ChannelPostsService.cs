using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Application.DTOs.Core.ChannelPosts;
using VidiMetrics.Application.DTOs.Core.Channels;
using VidiMetrics.Application.Interfaces.Core;
using VidiMetrics.DataAccess.Repositories.Core.Channels;
using VidiMetrics.DataAccess.Repositories.Core.ChannelsPosts;
using VidiMetrics.Domain.Models.Core;

namespace VidiMetrics.Application.Services.Core
{
    public class ChannelPostsService : IChannelPostsService
    {
        private readonly IChannelPostsRepository _repository;
        private readonly IMapper _mapper;
        private readonly IValidator<CreateChannelPostDto> _createValidator;
        private readonly IValidator<UpdateChannelPostDto> _updateValidator;

        public ChannelPostsService(
            IChannelPostsRepository repository,
            IMapper mapper,
            IValidator<CreateChannelPostDto> createValidator,
            IValidator<UpdateChannelPostDto> updateValidator)
        {
            _repository = repository;
            _mapper = mapper;
            _createValidator = createValidator;
            _updateValidator = updateValidator;
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
            var channelExist = await _repository.Query()
            .AnyAsync(x => x.Id == dto.ChannelId && x.Channel.UserId == userId);
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
    }
}
