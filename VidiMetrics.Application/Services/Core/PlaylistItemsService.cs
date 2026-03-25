using AutoMapper;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Core.PlaylistItems;
using VidiMetrics.Application.Interfaces.Core;
using VidiMetrics.DataAccess.Repositories.Core.PlaylistItems;
using VidiMetrics.Domain.Models.Core;

namespace VidiMetrics.Application.Services.Core
{
    public class PlaylistItemsService : IPlaylistItemsService
    {
        private readonly IPlaylistItemsRepository _repository;
        private readonly IMapper _mapper;
        private readonly IValidator<CreatePlaylistItemDto> _createValidator;
        private readonly IValidator<UpdatePlaylistItemDto> _updateValidator;

        public PlaylistItemsService(
            IPlaylistItemsRepository repository, 
            IMapper mapper,
            IValidator<CreatePlaylistItemDto> createValidator,
            IValidator<UpdatePlaylistItemDto> updateValidator)
        {
            _repository = repository;
            _mapper = mapper;
            _createValidator = createValidator;
            _updateValidator = updateValidator;
        }

        public async Task<PlaylistItemResponseDto> GetByIdAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("PlaylistItem not found.");

            return _mapper.Map<PlaylistItemResponseDto>(entity);
        }

        public async Task<IEnumerable<PlaylistItemResponseDto>> GetAllAsync()
        {
            var entities = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<PlaylistItemResponseDto>>(entities);
        }

        public async Task<PlaylistItemResponseDto> CreateAsync(CreatePlaylistItemDto dto)
        {
            await _createValidator.ValidateAndThrowAsync(dto);

            var entity = _mapper.Map<PlaylistItem>(dto);
            // Assuming BaseEntity has CreatedAt or similar if needed, otherwise skip
            // entity.CreatedAt = DateTime.UtcNow; 

            await _repository.AddAsync(entity);
            await _repository.SaveChangesAsync();

            return _mapper.Map<PlaylistItemResponseDto>(entity);
        }

        public async Task<PlaylistItemResponseDto> UpdateAsync(Guid id, UpdatePlaylistItemDto dto)
        {
            await _updateValidator.ValidateAndThrowAsync(dto);

            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("PlaylistItem not found.");

            _mapper.Map(dto, entity);

            _repository.Update(entity);
            await _repository.SaveChangesAsync();

            return _mapper.Map<PlaylistItemResponseDto>(entity);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("PlaylistItem not found.");

            _repository.Remove(entity);
            return await _repository.SaveChangesAsync();
        }
    }
}
