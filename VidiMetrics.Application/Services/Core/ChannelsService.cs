using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using VidiMetrics.Application.DTOs.Core.Channels;
using VidiMetrics.Application.Interfaces.Core;
using VidiMetrics.DataAccess.Repositories.Core.Channels;
using VidiMetrics.Domain.Models.Core;

namespace VidiMetrics.Application.Services.Core
{
    public class ChannelsService : IChannelsService
    {
        private readonly IChannelsRepository _repository;
        private readonly IMapper _mapper;
        private readonly IValidator<CreateChannelDto> _createValidator;
        private readonly IValidator<UpdateChannelDto> _updateValidator;

        public ChannelsService(
            IChannelsRepository repository,

            IMapper mapper,
            IValidator<CreateChannelDto> createValidator,
            IValidator<UpdateChannelDto> updateValidator)
        {
            _repository = repository;
            _mapper = mapper;
            _createValidator = createValidator;
            _updateValidator = updateValidator;
        }

        public async Task<ChannelResponseDto> GetByIdAsync(Guid id, Guid userId)
        {
            var entity = await _repository.Query()
               .Include(x => x.ChannelStat)
               .FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId);
            if (entity == null) throw new Exception("Channel not found.");

            return _mapper.Map<ChannelResponseDto>(entity);
        }

        public async Task<IEnumerable<ChannelResponseDto>> GetByUserIdAsync(Guid userId)
        {
            var entity = await _repository.Query()
               .Include(x => x.ChannelStat)
               .Where(s => s.UserId == userId).ToListAsync();
            return _mapper.Map<IEnumerable<ChannelResponseDto>>(entity);
        }

        public async Task<IEnumerable<ChannelResponseDto>> GetAllAsync()
        {
            var entities = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<ChannelResponseDto>>(entities);
        }

        public async Task<ChannelResponseDto> CreateAsync(CreateChannelDto dto, Guid userId)
        {
            await _createValidator.ValidateAndThrowAsync(dto);

            var entity = _mapper.Map<Channel>(dto);
            entity.UserId = userId;
            entity.CreatedBy = userId;
            entity.CreatedAt = DateTime.UtcNow;

            await _repository.AddAsync(entity);
            await _repository.SaveChangesAsync();

            return _mapper.Map<ChannelResponseDto>(entity);
        }

        public async Task<ChannelResponseDto> UpdateAsync(Guid id, UpdateChannelDto dto, Guid userId)
        {
            await _updateValidator.ValidateAndThrowAsync(dto);
            var entity = await _repository.Query()
                .FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId);

            if (entity == null) throw new UnauthorizedAccessException("Invalid Channel selection or access denied.");

            _mapper.Map(dto, entity);
            entity.UpdatedAt = DateTime.UtcNow;

            _repository.Update(entity);
            await _repository.SaveChangesAsync();

            return _mapper.Map<ChannelResponseDto>(entity);
        }

        public async Task<bool> DeleteAsync(Guid id, Guid userId)
        {
            var entity = await _repository.Query()
                .FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId);
            if (entity == null) throw new UnauthorizedAccessException("Invalid Channel selection or access denied.");

            _repository.Remove(entity);
            return await _repository.SaveChangesAsync();
        }
    }
}
