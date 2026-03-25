using AutoMapper;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Ai.AiTasks;
using VidiMetrics.Application.Interfaces.Ai;
using VidiMetrics.DataAccess.Repositories.Ai.AiTasks;
using VidiMetrics.Domain.Models.Ai;

namespace VidiMetrics.Application.Services.Ai
{
    public class AiTasksService : IAiTasksService
    {
        private readonly IAiTasksRepository _repository;
        private readonly IMapper _mapper;
        private readonly IValidator<CreateAiTaskDto> _createValidator;
        private readonly IValidator<UpdateAiTaskDto> _updateValidator;

        public AiTasksService(
            IAiTasksRepository repository, 
            IMapper mapper,
            IValidator<CreateAiTaskDto> createValidator,
            IValidator<UpdateAiTaskDto> updateValidator)
        {
            _repository = repository;
            _mapper = mapper;
            _createValidator = createValidator;
            _updateValidator = updateValidator;
        }

        public async Task<AiTaskResponseDto> GetByIdAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("AiTask not found.");

            return _mapper.Map<AiTaskResponseDto>(entity);
        }

        public async Task<IEnumerable<AiTaskResponseDto>> GetAllAsync()
        {
            var entities = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<AiTaskResponseDto>>(entities);
        }

        public async Task<AiTaskResponseDto> CreateAsync(CreateAiTaskDto dto)
        {
            await _createValidator.ValidateAndThrowAsync(dto);

            var entity = _mapper.Map<AiTask>(dto);
            // Assuming BaseEntity has CreatedAt or similar if needed, otherwise skip
            // entity.CreatedAt = DateTime.UtcNow; 

            await _repository.AddAsync(entity);
            await _repository.SaveChangesAsync();

            return _mapper.Map<AiTaskResponseDto>(entity);
        }

        public async Task<AiTaskResponseDto> UpdateAsync(Guid id, UpdateAiTaskDto dto)
        {
            await _updateValidator.ValidateAndThrowAsync(dto);

            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("AiTask not found.");

            _mapper.Map(dto, entity);

            _repository.Update(entity);
            await _repository.SaveChangesAsync();

            return _mapper.Map<AiTaskResponseDto>(entity);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("AiTask not found.");

            _repository.Remove(entity);
            return await _repository.SaveChangesAsync();
        }
    }
}
