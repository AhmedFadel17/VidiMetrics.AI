using AutoMapper;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Seo.KeywordRankings;
using VidiMetrics.Application.Interfaces.Seo;
using VidiMetrics.DataAccess.Repositories.Seo.KeywordRankings;
using VidiMetrics.Domain.Models.Seo;

namespace VidiMetrics.Application.Services.Seo
{
    public class KeywordRankingsService : IKeywordRankingsService
    {
        private readonly IKeywordRankingsRepository _repository;
        private readonly IMapper _mapper;
        private readonly IValidator<CreateKeywordRankingDto> _createValidator;
        private readonly IValidator<UpdateKeywordRankingDto> _updateValidator;

        public KeywordRankingsService(
            IKeywordRankingsRepository repository, 
            IMapper mapper,
            IValidator<CreateKeywordRankingDto> createValidator,
            IValidator<UpdateKeywordRankingDto> updateValidator)
        {
            _repository = repository;
            _mapper = mapper;
            _createValidator = createValidator;
            _updateValidator = updateValidator;
        }

        public async Task<KeywordRankingResponseDto> GetByIdAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("KeywordRanking not found.");

            return _mapper.Map<KeywordRankingResponseDto>(entity);
        }

        public async Task<IEnumerable<KeywordRankingResponseDto>> GetAllAsync()
        {
            var entities = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<KeywordRankingResponseDto>>(entities);
        }

        public async Task<KeywordRankingResponseDto> CreateAsync(CreateKeywordRankingDto dto)
        {
            await _createValidator.ValidateAndThrowAsync(dto);

            var entity = _mapper.Map<KeywordRanking>(dto);
            // Assuming BaseEntity has CreatedAt or similar if needed, otherwise skip
            // entity.CreatedAt = DateTime.UtcNow; 

            await _repository.AddAsync(entity);
            await _repository.SaveChangesAsync();

            return _mapper.Map<KeywordRankingResponseDto>(entity);
        }

        public async Task<KeywordRankingResponseDto> UpdateAsync(Guid id, UpdateKeywordRankingDto dto)
        {
            await _updateValidator.ValidateAndThrowAsync(dto);

            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("KeywordRanking not found.");

            _mapper.Map(dto, entity);

            _repository.Update(entity);
            await _repository.SaveChangesAsync();

            return _mapper.Map<KeywordRankingResponseDto>(entity);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("KeywordRanking not found.");

            _repository.Remove(entity);
            return await _repository.SaveChangesAsync();
        }
    }
}
