using AutoMapper;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Core.Playlists;
using VidiMetrics.Application.Interfaces.Core;
using VidiMetrics.DataAccess.Repositories.Core.Playlists;
using VidiMetrics.Domain.Models.Core;

namespace VidiMetrics.Application.Services.Core
{
    public class PlaylistsService : IPlaylistsService
    {
        private readonly IPlaylistsRepository _repository;
        private readonly IMapper _mapper;
        private readonly IValidator<CreatePlaylistDto> _createValidator;
        private readonly IValidator<UpdatePlaylistDto> _updateValidator;

        public PlaylistsService(
            IPlaylistsRepository repository, 
            IMapper mapper,
            IValidator<CreatePlaylistDto> createValidator,
            IValidator<UpdatePlaylistDto> updateValidator)
        {
            _repository = repository;
            _mapper = mapper;
            _createValidator = createValidator;
            _updateValidator = updateValidator;
        }

        public async Task<PlaylistResponseDto> GetByIdAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("Playlist not found.");

            return _mapper.Map<PlaylistResponseDto>(entity);
        }

        public async Task<IEnumerable<PlaylistResponseDto>> GetAllAsync()
        {
            var entities = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<PlaylistResponseDto>>(entities);
        }

        public async Task<PlaylistResponseDto> CreateAsync(CreatePlaylistDto dto)
        {
            await _createValidator.ValidateAndThrowAsync(dto);

            var entity = _mapper.Map<Playlist>(dto);
            // Assuming BaseEntity has CreatedAt or similar if needed, otherwise skip
            // entity.CreatedAt = DateTime.UtcNow; 

            await _repository.AddAsync(entity);
            await _repository.SaveChangesAsync();

            return _mapper.Map<PlaylistResponseDto>(entity);
        }

        public async Task<PlaylistResponseDto> UpdateAsync(Guid id, UpdatePlaylistDto dto)
        {
            await _updateValidator.ValidateAndThrowAsync(dto);

            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("Playlist not found.");

            _mapper.Map(dto, entity);

            _repository.Update(entity);
            await _repository.SaveChangesAsync();

            return _mapper.Map<PlaylistResponseDto>(entity);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("Playlist not found.");

            _repository.Remove(entity);
            return await _repository.SaveChangesAsync();
        }
    }
}
