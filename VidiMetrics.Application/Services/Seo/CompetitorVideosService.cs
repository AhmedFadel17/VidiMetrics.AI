using AutoMapper;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Seo.CompetitorVideos;
using VidiMetrics.Application.Interfaces.Seo;
using VidiMetrics.DataAccess.Repositories.Seo.CompetitorVideos;
using VidiMetrics.Domain.Models.Seo;

namespace VidiMetrics.Application.Services.Seo
{
    public class CompetitorVideosService : ICompetitorVideosService
    {
        private readonly ICompetitorVideosRepository _repository;
        private readonly IMapper _mapper;
        private readonly IValidator<CreateCompetitorVideoDto> _createValidator;
        private readonly IValidator<UpdateCompetitorVideoDto> _updateValidator;

        public CompetitorVideosService(
            ICompetitorVideosRepository repository, 
            IMapper mapper,
            IValidator<CreateCompetitorVideoDto> createValidator,
            IValidator<UpdateCompetitorVideoDto> updateValidator)
        {
            _repository = repository;
            _mapper = mapper;
            _createValidator = createValidator;
            _updateValidator = updateValidator;
        }

        public async Task<CompetitorVideoResponseDto> GetByIdAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("CompetitorVideo not found.");

            return _mapper.Map<CompetitorVideoResponseDto>(entity);
        }

        public async Task<IEnumerable<CompetitorVideoResponseDto>> GetAllAsync()
        {
            var entities = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<CompetitorVideoResponseDto>>(entities);
        }

        public async Task<CompetitorVideoResponseDto> CreateAsync(CreateCompetitorVideoDto dto)
        {
            await _createValidator.ValidateAndThrowAsync(dto);

            var entity = _mapper.Map<CompetitorVideo>(dto);
            // Assuming BaseEntity has CreatedAt or similar if needed, otherwise skip
            // entity.CreatedAt = DateTime.UtcNow; 

            await _repository.AddAsync(entity);
            await _repository.SaveChangesAsync();

            return _mapper.Map<CompetitorVideoResponseDto>(entity);
        }

        public async Task<CompetitorVideoResponseDto> UpdateAsync(Guid id, UpdateCompetitorVideoDto dto)
        {
            await _updateValidator.ValidateAndThrowAsync(dto);

            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("CompetitorVideo not found.");

            _mapper.Map(dto, entity);

            _repository.Update(entity);
            await _repository.SaveChangesAsync();

            return _mapper.Map<CompetitorVideoResponseDto>(entity);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("CompetitorVideo not found.");

            _repository.Remove(entity);
            return await _repository.SaveChangesAsync();
        }
    }
}
