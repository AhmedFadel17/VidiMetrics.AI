using AutoMapper;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Infra.ApiUsageQuotas;
using VidiMetrics.Application.Interfaces.Infra;
using VidiMetrics.DataAccess.Repositories.Infra.ApiUsageQuotas;
using VidiMetrics.Domain.Models.Infra;

namespace VidiMetrics.Application.Services.Infra
{
    public class ApiUsageQuotasService : IApiUsageQuotasService
    {
        private readonly IApiUsageQuotasRepository _repository;
        private readonly IMapper _mapper;
        private readonly IValidator<CreateApiUsageQuotaDto> _createValidator;
        private readonly IValidator<UpdateApiUsageQuotaDto> _updateValidator;

        public ApiUsageQuotasService(
            IApiUsageQuotasRepository repository, 
            IMapper mapper,
            IValidator<CreateApiUsageQuotaDto> createValidator,
            IValidator<UpdateApiUsageQuotaDto> updateValidator)
        {
            _repository = repository;
            _mapper = mapper;
            _createValidator = createValidator;
            _updateValidator = updateValidator;
        }

        public async Task<ApiUsageQuotaResponseDto> GetByIdAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("ApiUsageQuota not found.");

            return _mapper.Map<ApiUsageQuotaResponseDto>(entity);
        }

        public async Task<IEnumerable<ApiUsageQuotaResponseDto>> GetAllAsync()
        {
            var entities = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<ApiUsageQuotaResponseDto>>(entities);
        }

        public async Task<ApiUsageQuotaResponseDto> CreateAsync(CreateApiUsageQuotaDto dto)
        {
            await _createValidator.ValidateAndThrowAsync(dto);

            var entity = _mapper.Map<ApiUsageQuota>(dto);
            // Assuming BaseEntity has CreatedAt or similar if needed, otherwise skip
            // entity.CreatedAt = DateTime.UtcNow; 

            await _repository.AddAsync(entity);
            await _repository.SaveChangesAsync();

            return _mapper.Map<ApiUsageQuotaResponseDto>(entity);
        }

        public async Task<ApiUsageQuotaResponseDto> UpdateAsync(Guid id, UpdateApiUsageQuotaDto dto)
        {
            await _updateValidator.ValidateAndThrowAsync(dto);

            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("ApiUsageQuota not found.");

            _mapper.Map(dto, entity);

            _repository.Update(entity);
            await _repository.SaveChangesAsync();

            return _mapper.Map<ApiUsageQuotaResponseDto>(entity);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("ApiUsageQuota not found.");

            _repository.Remove(entity);
            return await _repository.SaveChangesAsync();
        }
    }
}
