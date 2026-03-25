using AutoMapper;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Seo.SeoAudits;
using VidiMetrics.Application.Interfaces.Seo;
using VidiMetrics.DataAccess.Repositories.Seo.SeoAudits;
using VidiMetrics.Domain.Models.Seo;

namespace VidiMetrics.Application.Services.Seo
{
    public class SeoAuditsService : ISeoAuditsService
    {
        private readonly ISeoAuditsRepository _repository;
        private readonly IMapper _mapper;
        private readonly IValidator<CreateSeoAuditDto> _createValidator;
        private readonly IValidator<UpdateSeoAuditDto> _updateValidator;

        public SeoAuditsService(
            ISeoAuditsRepository repository, 
            IMapper mapper,
            IValidator<CreateSeoAuditDto> createValidator,
            IValidator<UpdateSeoAuditDto> updateValidator)
        {
            _repository = repository;
            _mapper = mapper;
            _createValidator = createValidator;
            _updateValidator = updateValidator;
        }

        public async Task<SeoAuditResponseDto> GetByIdAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("SeoAudit not found.");

            return _mapper.Map<SeoAuditResponseDto>(entity);
        }

        public async Task<IEnumerable<SeoAuditResponseDto>> GetAllAsync()
        {
            var entities = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<SeoAuditResponseDto>>(entities);
        }

        public async Task<SeoAuditResponseDto> CreateAsync(CreateSeoAuditDto dto)
        {
            await _createValidator.ValidateAndThrowAsync(dto);

            var entity = _mapper.Map<SeoAudit>(dto);
            // Assuming BaseEntity has CreatedAt or similar if needed, otherwise skip
            // entity.CreatedAt = DateTime.UtcNow; 

            await _repository.AddAsync(entity);
            await _repository.SaveChangesAsync();

            return _mapper.Map<SeoAuditResponseDto>(entity);
        }

        public async Task<SeoAuditResponseDto> UpdateAsync(Guid id, UpdateSeoAuditDto dto)
        {
            await _updateValidator.ValidateAndThrowAsync(dto);

            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("SeoAudit not found.");

            _mapper.Map(dto, entity);

            _repository.Update(entity);
            await _repository.SaveChangesAsync();

            return _mapper.Map<SeoAuditResponseDto>(entity);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("SeoAudit not found.");

            _repository.Remove(entity);
            return await _repository.SaveChangesAsync();
        }
    }
}
