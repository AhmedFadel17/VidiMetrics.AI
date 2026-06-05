using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using VidiMetrics.Application.DTOs.Infra.UserProfiles;
using VidiMetrics.Application.Interfaces.Infra;
using VidiMetrics.Application.Providers.StorageProviders;
using VidiMetrics.DataAccess.Repositories.Infra.UserProfiles;
using VidiMetrics.Domain.Models.Infra;

namespace VidiMetrics.Application.Services.Infra
{
    public class UserProfilesService : IUserProfilesService
    {
        private readonly IUserProfilesRepository _repository;
        private readonly IMapper _mapper;
        private readonly IValidator<CreateUserProfileDto> _createValidator;
        private readonly IValidator<UpdateUserProfileDto> _updateValidator;
        private readonly IValidator<UploadProfilePictureDto> _uploadProfilePictureValidator;
        private readonly IUserSubscriptionsService _subscriptionService;
        private readonly IStorageProvider _storageProvider;
        public UserProfilesService(
            IUserProfilesRepository repository,

            IMapper mapper,
            IValidator<CreateUserProfileDto> createValidator,
            IValidator<UpdateUserProfileDto> updateValidator,
            IValidator<UploadProfilePictureDto> uploadProfilePictureValidator,
            IUserSubscriptionsService subscriptionService,
            IStorageProvider storageService)
        {
            _repository = repository;
            _mapper = mapper;
            _createValidator = createValidator;
            _updateValidator = updateValidator;
            _uploadProfilePictureValidator = uploadProfilePictureValidator;
            _subscriptionService = subscriptionService;
            _storageProvider = storageService;
        }

        public async Task<UserProfileResponseDto> GetByIdAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("UserProfile not found.");

            return _mapper.Map<UserProfileResponseDto>(entity);
        }

        public async Task<IEnumerable<UserProfileResponseDto>> GetAllAsync()
        {
            var entities = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<UserProfileResponseDto>>(entities);
        }

        public async Task<UserProfileResponseDto> CreateAsync(CreateUserProfileDto dto)
        {
            await _createValidator.ValidateAndThrowAsync(dto);
            using var transaction = await _repository.BeginTransactionAsync();

            try
            {
                var entity = _mapper.Map<UserProfile>(dto);
                entity.CreatedAt = DateTime.UtcNow;
                await _repository.AddAsync(entity);
                await _repository.SaveChangesAsync();
                await _subscriptionService.CreateInitialFreeSubscriptionAsync(entity.UserId);
                await _subscriptionService.CreateInitialWalletAsync(entity.UserId);
                await transaction.CommitAsync();
                return _mapper.Map<UserProfileResponseDto>(entity);
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<UserProfileResponseDto> UpdateAsync(Guid id, UpdateUserProfileDto dto)
        {
            await _updateValidator.ValidateAndThrowAsync(dto);

            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("UserProfile not found.");

            _mapper.Map(dto, entity);

            _repository.Update(entity);
            await _repository.SaveChangesAsync();

            return _mapper.Map<UserProfileResponseDto>(entity);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("UserProfile not found.");

            _repository.Remove(entity);
            return await _repository.SaveChangesAsync();
        }

        public async Task<UserProfileResponseDto> UpdateProfilePictureAsync(Guid userId, UploadProfilePictureDto dto)
        {
            await _uploadProfilePictureValidator.ValidateAndThrowAsync(dto);
            var profile = await _repository.Query().FirstOrDefaultAsync(x => x.UserId == userId);
            if (profile == null) throw new Exception("UserProfile not found.");
            var url = await _storageProvider.UploadImageFileAsync(dto.File, $"avatars/{userId.ToString()}");
            profile.ProfilePictureUrl = url;
            _repository.Update(profile);
            await _repository.SaveChangesAsync();
            return _mapper.Map<UserProfileResponseDto>(profile);
        }
    }
}
