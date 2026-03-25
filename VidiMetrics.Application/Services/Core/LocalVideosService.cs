using AutoMapper;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Core.LocalVideos;
using VidiMetrics.Application.Interfaces.Core;
using VidiMetrics.DataAccess.Repositories.Core.LocalVideos;
using VidiMetrics.Domain.Models.Core;

namespace VidiMetrics.Application.Services.Core
{
    public class LocalVideosService : ILocalVideosService
    {
        private readonly ILocalVideosRepository _repository;
        private readonly IMapper _mapper;
        private readonly IValidator<CreateLocalVideoDto> _createValidator;
        private readonly IValidator<UpdateLocalVideoDto> _updateValidator;

        public LocalVideosService(
            ILocalVideosRepository repository, 
            IMapper mapper,
            IValidator<CreateLocalVideoDto> createValidator,
            IValidator<UpdateLocalVideoDto> updateValidator)
        {
            _repository = repository;
            _mapper = mapper;
            _createValidator = createValidator;
            _updateValidator = updateValidator;
        }

        public async Task<LocalVideoResponseDto> GetByIdAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("LocalVideo not found.");

            return _mapper.Map<LocalVideoResponseDto>(entity);
        }

        public async Task<IEnumerable<LocalVideoResponseDto>> GetAllAsync()
        {
            var entities = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<LocalVideoResponseDto>>(entities);
        }

        public async Task<LocalVideoResponseDto> CreateAsync(CreateLocalVideoDto dto)
        {
            await _createValidator.ValidateAndThrowAsync(dto);

            var entity = _mapper.Map<LocalVideo>(dto);
            // Assuming BaseEntity has CreatedAt or similar if needed, otherwise skip
            // entity.CreatedAt = DateTime.UtcNow; 

            await _repository.AddAsync(entity);
            await _repository.SaveChangesAsync();

            return _mapper.Map<LocalVideoResponseDto>(entity);
        }

        public async Task<LocalVideoResponseDto> UpdateAsync(Guid id, UpdateLocalVideoDto dto)
        {
            await _updateValidator.ValidateAndThrowAsync(dto);

            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("LocalVideo not found.");

            _mapper.Map(dto, entity);

            _repository.Update(entity);
            await _repository.SaveChangesAsync();

            return _mapper.Map<LocalVideoResponseDto>(entity);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("LocalVideo not found.");

            _repository.Remove(entity);
            return await _repository.SaveChangesAsync();
        }
    }
}
