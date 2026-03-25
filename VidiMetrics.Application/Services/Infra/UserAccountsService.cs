using AutoMapper;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Infra.UserAccounts;
using VidiMetrics.Application.Interfaces.Infra;
using VidiMetrics.DataAccess.Repositories.Infra.UserAccounts;
using VidiMetrics.Domain.Models.Infra;

namespace VidiMetrics.Application.Services.Infra
{
    public class UserAccountsService : IUserAccountsService
    {
        private readonly IUserAccountsRepository _repository;
        private readonly IMapper _mapper;
        private readonly IValidator<CreateUserAccountDto> _createValidator;
        private readonly IValidator<UpdateUserAccountDto> _updateValidator;

        public UserAccountsService(
            IUserAccountsRepository repository, 
            IMapper mapper,
            IValidator<CreateUserAccountDto> createValidator,
            IValidator<UpdateUserAccountDto> updateValidator)
        {
            _repository = repository;
            _mapper = mapper;
            _createValidator = createValidator;
            _updateValidator = updateValidator;
        }

        public async Task<UserAccountResponseDto> GetByIdAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("UserAccount not found.");

            return _mapper.Map<UserAccountResponseDto>(entity);
        }

        public async Task<IEnumerable<UserAccountResponseDto>> GetAllAsync()
        {
            var entities = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<UserAccountResponseDto>>(entities);
        }

        public async Task<UserAccountResponseDto> CreateAsync(CreateUserAccountDto dto)
        {
            await _createValidator.ValidateAndThrowAsync(dto);

            var entity = _mapper.Map<UserAccount>(dto);
            // Assuming BaseEntity has CreatedAt or similar if needed, otherwise skip
            // entity.CreatedAt = DateTime.UtcNow; 

            await _repository.AddAsync(entity);
            await _repository.SaveChangesAsync();

            return _mapper.Map<UserAccountResponseDto>(entity);
        }

        public async Task<UserAccountResponseDto> UpdateAsync(Guid id, UpdateUserAccountDto dto)
        {
            await _updateValidator.ValidateAndThrowAsync(dto);

            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("UserAccount not found.");

            _mapper.Map(dto, entity);

            _repository.Update(entity);
            await _repository.SaveChangesAsync();

            return _mapper.Map<UserAccountResponseDto>(entity);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("UserAccount not found.");

            _repository.Remove(entity);
            return await _repository.SaveChangesAsync();
        }
    }
}
