using AutoMapper;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.StoryEngine.StoryEnvironments;
using VidiMetrics.Application.Interfaces.StoryEngine;
using VidiMetrics.DataAccess.Repositories.StoryEngine.StoryEnvironments;
using VidiMetrics.Domain.Models.StoryEngine;

namespace VidiMetrics.Application.Services.StoryEngine
{
    public class StoryEnvironmentsService : IStoryEnvironmentsService
    {
        private readonly IStoryEnvironmentsRepository _repository;
        private readonly IMapper _mapper;
        private readonly IValidator<CreateStoryEnvironmentDto> _createValidator;
        private readonly IValidator<UpdateStoryEnvironmentDto> _updateValidator;

        public StoryEnvironmentsService(
            IStoryEnvironmentsRepository repository, 
            IMapper mapper,
            IValidator<CreateStoryEnvironmentDto> createValidator,
            IValidator<UpdateStoryEnvironmentDto> updateValidator)
        {
            _repository = repository;
            _mapper = mapper;
            _createValidator = createValidator;
            _updateValidator = updateValidator;
        }

        public async Task<StoryEnvironmentResponseDto> GetByIdAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("StoryEnvironment not found.");

            return _mapper.Map<StoryEnvironmentResponseDto>(entity);
        }

        public async Task<IEnumerable<StoryEnvironmentResponseDto>> GetAllAsync()
        {
            var entities = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<StoryEnvironmentResponseDto>>(entities);
        }

        public async Task<StoryEnvironmentResponseDto> CreateAsync(CreateStoryEnvironmentDto dto)
        {
            await _createValidator.ValidateAndThrowAsync(dto);

            var entity = _mapper.Map<StoryEnvironment>(dto);
            // Assuming BaseEntity has CreatedAt or similar if needed, otherwise skip
            // entity.CreatedAt = DateTime.UtcNow; 

            await _repository.AddAsync(entity);
            await _repository.SaveChangesAsync();

            return _mapper.Map<StoryEnvironmentResponseDto>(entity);
        }

        public async Task<StoryEnvironmentResponseDto> UpdateAsync(Guid id, UpdateStoryEnvironmentDto dto)
        {
            await _updateValidator.ValidateAndThrowAsync(dto);

            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("StoryEnvironment not found.");

            _mapper.Map(dto, entity);

            _repository.Update(entity);
            await _repository.SaveChangesAsync();

            return _mapper.Map<StoryEnvironmentResponseDto>(entity);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("StoryEnvironment not found.");

            _repository.Remove(entity);
            return await _repository.SaveChangesAsync();
        }
    }
}
