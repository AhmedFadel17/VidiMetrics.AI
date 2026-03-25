using AutoMapper;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Seo.Keywords;
using VidiMetrics.Application.Interfaces.Seo;
using VidiMetrics.DataAccess.Repositories.Seo.Keywords;
using VidiMetrics.Domain.Models.Seo;

namespace VidiMetrics.Application.Services.Seo
{
    public class KeywordsService : IKeywordsService
    {
        private readonly IKeywordsRepository _repository;
        private readonly IMapper _mapper;
        private readonly IValidator<CreateKeywordDto> _createValidator;
        private readonly IValidator<UpdateKeywordDto> _updateValidator;

        public KeywordsService(
            IKeywordsRepository repository, 
            IMapper mapper,
            IValidator<CreateKeywordDto> createValidator,
            IValidator<UpdateKeywordDto> updateValidator)
        {
            _repository = repository;
            _mapper = mapper;
            _createValidator = createValidator;
            _updateValidator = updateValidator;
        }

        public async Task<KeywordResponseDto> GetByIdAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("Keyword not found.");

            return _mapper.Map<KeywordResponseDto>(entity);
        }

        public async Task<IEnumerable<KeywordResponseDto>> GetAllAsync()
        {
            var entities = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<KeywordResponseDto>>(entities);
        }

        public async Task<KeywordResponseDto> CreateAsync(CreateKeywordDto dto)
        {
            await _createValidator.ValidateAndThrowAsync(dto);

            var entity = _mapper.Map<Keyword>(dto);
            // Assuming BaseEntity has CreatedAt or similar if needed, otherwise skip
            // entity.CreatedAt = DateTime.UtcNow; 

            await _repository.AddAsync(entity);
            await _repository.SaveChangesAsync();

            return _mapper.Map<KeywordResponseDto>(entity);
        }

        public async Task<KeywordResponseDto> UpdateAsync(Guid id, UpdateKeywordDto dto)
        {
            await _updateValidator.ValidateAndThrowAsync(dto);

            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("Keyword not found.");

            _mapper.Map(dto, entity);

            _repository.Update(entity);
            await _repository.SaveChangesAsync();

            return _mapper.Map<KeywordResponseDto>(entity);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("Keyword not found.");

            _repository.Remove(entity);
            return await _repository.SaveChangesAsync();
        }
    }
}
