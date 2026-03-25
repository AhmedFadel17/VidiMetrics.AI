using AutoMapper;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Ai.AiPromptTemplates;
using VidiMetrics.Application.Interfaces.Ai;
using VidiMetrics.DataAccess.Repositories.Ai.AiPromptTemplates;
using VidiMetrics.Domain.Models.Ai;

namespace VidiMetrics.Application.Services.Ai
{
    public class AiPromptTemplatesService : IAiPromptTemplatesService
    {
        private readonly IAiPromptTemplatesRepository _repository;
        private readonly IMapper _mapper;
        private readonly IValidator<CreateAiPromptTemplateDto> _createValidator;
        private readonly IValidator<UpdateAiPromptTemplateDto> _updateValidator;

        public AiPromptTemplatesService(
            IAiPromptTemplatesRepository repository, 
            IMapper mapper,
            IValidator<CreateAiPromptTemplateDto> createValidator,
            IValidator<UpdateAiPromptTemplateDto> updateValidator)
        {
            _repository = repository;
            _mapper = mapper;
            _createValidator = createValidator;
            _updateValidator = updateValidator;
        }

        public async Task<AiPromptTemplateResponseDto> GetByIdAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("AiPromptTemplate not found.");

            return _mapper.Map<AiPromptTemplateResponseDto>(entity);
        }

        public async Task<IEnumerable<AiPromptTemplateResponseDto>> GetAllAsync()
        {
            var entities = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<AiPromptTemplateResponseDto>>(entities);
        }

        public async Task<AiPromptTemplateResponseDto> CreateAsync(CreateAiPromptTemplateDto dto)
        {
            await _createValidator.ValidateAndThrowAsync(dto);

            var entity = _mapper.Map<AiPromptTemplate>(dto);
            // Assuming BaseEntity has CreatedAt or similar if needed, otherwise skip
            // entity.CreatedAt = DateTime.UtcNow; 

            await _repository.AddAsync(entity);
            await _repository.SaveChangesAsync();

            return _mapper.Map<AiPromptTemplateResponseDto>(entity);
        }

        public async Task<AiPromptTemplateResponseDto> UpdateAsync(Guid id, UpdateAiPromptTemplateDto dto)
        {
            await _updateValidator.ValidateAndThrowAsync(dto);

            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("AiPromptTemplate not found.");

            _mapper.Map(dto, entity);

            _repository.Update(entity);
            await _repository.SaveChangesAsync();

            return _mapper.Map<AiPromptTemplateResponseDto>(entity);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("AiPromptTemplate not found.");

            _repository.Remove(entity);
            return await _repository.SaveChangesAsync();
        }
    }
}
