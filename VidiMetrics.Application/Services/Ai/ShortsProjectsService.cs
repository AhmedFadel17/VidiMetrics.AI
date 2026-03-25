using AutoMapper;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Ai.ShortsProjects;
using VidiMetrics.Application.Interfaces.Ai;
using VidiMetrics.DataAccess.Repositories.Ai.ShortsProjects;
using VidiMetrics.Domain.Models.Ai;

namespace VidiMetrics.Application.Services.Ai
{
    public class ShortsProjectsService : IShortsProjectsService
    {
        private readonly IShortsProjectsRepository _repository;
        private readonly IMapper _mapper;
        private readonly IValidator<CreateShortsProjectDto> _createValidator;
        private readonly IValidator<UpdateShortsProjectDto> _updateValidator;

        public ShortsProjectsService(
            IShortsProjectsRepository repository, 
            IMapper mapper,
            IValidator<CreateShortsProjectDto> createValidator,
            IValidator<UpdateShortsProjectDto> updateValidator)
        {
            _repository = repository;
            _mapper = mapper;
            _createValidator = createValidator;
            _updateValidator = updateValidator;
        }

        public async Task<ShortsProjectResponseDto> GetByIdAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("ShortsProject not found.");

            return _mapper.Map<ShortsProjectResponseDto>(entity);
        }

        public async Task<IEnumerable<ShortsProjectResponseDto>> GetAllAsync()
        {
            var entities = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<ShortsProjectResponseDto>>(entities);
        }

        public async Task<ShortsProjectResponseDto> CreateAsync(CreateShortsProjectDto dto)
        {
            await _createValidator.ValidateAndThrowAsync(dto);

            var entity = _mapper.Map<ShortsProject>(dto);
            // Assuming BaseEntity has CreatedAt or similar if needed, otherwise skip
            // entity.CreatedAt = DateTime.UtcNow; 

            await _repository.AddAsync(entity);
            await _repository.SaveChangesAsync();

            return _mapper.Map<ShortsProjectResponseDto>(entity);
        }

        public async Task<ShortsProjectResponseDto> UpdateAsync(Guid id, UpdateShortsProjectDto dto)
        {
            await _updateValidator.ValidateAndThrowAsync(dto);

            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("ShortsProject not found.");

            _mapper.Map(dto, entity);

            _repository.Update(entity);
            await _repository.SaveChangesAsync();

            return _mapper.Map<ShortsProjectResponseDto>(entity);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("ShortsProject not found.");

            _repository.Remove(entity);
            return await _repository.SaveChangesAsync();
        }
    }
}
