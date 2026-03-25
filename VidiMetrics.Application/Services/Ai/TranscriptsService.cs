using AutoMapper;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Ai.Transcripts;
using VidiMetrics.Application.Interfaces.Ai;
using VidiMetrics.DataAccess.Repositories.Ai.Transcripts;
using VidiMetrics.Domain.Models.Ai;

namespace VidiMetrics.Application.Services.Ai
{
    public class TranscriptsService : ITranscriptsService
    {
        private readonly ITranscriptsRepository _repository;
        private readonly IMapper _mapper;
        private readonly IValidator<CreateTranscriptDto> _createValidator;
        private readonly IValidator<UpdateTranscriptDto> _updateValidator;

        public TranscriptsService(
            ITranscriptsRepository repository, 
            IMapper mapper,
            IValidator<CreateTranscriptDto> createValidator,
            IValidator<UpdateTranscriptDto> updateValidator)
        {
            _repository = repository;
            _mapper = mapper;
            _createValidator = createValidator;
            _updateValidator = updateValidator;
        }

        public async Task<TranscriptResponseDto> GetByIdAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("Transcript not found.");

            return _mapper.Map<TranscriptResponseDto>(entity);
        }

        public async Task<IEnumerable<TranscriptResponseDto>> GetAllAsync()
        {
            var entities = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<TranscriptResponseDto>>(entities);
        }

        public async Task<TranscriptResponseDto> CreateAsync(CreateTranscriptDto dto)
        {
            await _createValidator.ValidateAndThrowAsync(dto);

            var entity = _mapper.Map<Transcript>(dto);
            // Assuming BaseEntity has CreatedAt or similar if needed, otherwise skip
            // entity.CreatedAt = DateTime.UtcNow; 

            await _repository.AddAsync(entity);
            await _repository.SaveChangesAsync();

            return _mapper.Map<TranscriptResponseDto>(entity);
        }

        public async Task<TranscriptResponseDto> UpdateAsync(Guid id, UpdateTranscriptDto dto)
        {
            await _updateValidator.ValidateAndThrowAsync(dto);

            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("Transcript not found.");

            _mapper.Map(dto, entity);

            _repository.Update(entity);
            await _repository.SaveChangesAsync();

            return _mapper.Map<TranscriptResponseDto>(entity);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("Transcript not found.");

            _repository.Remove(entity);
            return await _repository.SaveChangesAsync();
        }
    }
}
