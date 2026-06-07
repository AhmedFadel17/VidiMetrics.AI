using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using VidiMetrics.Application.DTOs.Core.Channels;
using VidiMetrics.Application.Interfaces.Core;
using VidiMetrics.Application.Providers.ChannelPlatformProviders;
using VidiMetrics.Application.Providers.NotificationsProviders;
using VidiMetrics.DataAccess.Repositories.Core.Channels;
using VidiMetrics.Domain.Enums;
using VidiMetrics.Domain.Models.Core;

namespace VidiMetrics.Application.Services.Core
{
    public class ChannelsService : IChannelsService
    {
        private readonly IChannelsRepository _repository;
        private readonly IMapper _mapper;
        private readonly IValidator<CreateChannelDto> _createValidator;
        private readonly IValidator<UpdateChannelDto> _updateValidator;
        private readonly Dictionary<TargetPlatform, IChannelPlatformProvider> _providers;
        private readonly INotificationProvider _notificationProvider;
        public ChannelsService(
            IChannelsRepository repository,
            IMapper mapper,
            IValidator<CreateChannelDto> createValidator,
            IValidator<UpdateChannelDto> updateValidator,
            IEnumerable<IChannelPlatformProvider> providers,
            INotificationProvider notificationProvider
            )
        {
            _repository = repository;
            _mapper = mapper;
            _createValidator = createValidator;
            _updateValidator = updateValidator;
            _providers = providers.ToDictionary(p => p.Platform);
            _notificationProvider = notificationProvider;
        }

        public async Task<ChannelResponseDto> GetByIdAsync(Guid id, Guid userId)
        {
            var entity = await _repository.Query()
               .Include(x => x.ChannelStat)
               .FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId);
            if (entity == null) throw new Exception("Channel not found.");

            return _mapper.Map<ChannelResponseDto>(entity);
        }

        public async Task<IEnumerable<ChannelResponseDto>> GetByUserIdAsync(Guid userId)
        {
            var entity = await _repository.Query()
               .Include(x => x.ChannelStat)
               .Where(s => s.UserId == userId).ToListAsync();
            return _mapper.Map<IEnumerable<ChannelResponseDto>>(entity);
        }

        public async Task<IEnumerable<ChannelResponseDto>> GetAllAsync()
        {
            var entities = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<ChannelResponseDto>>(entities);
        }

        public async Task<ChannelResponseDto> CreateAsync(CreateChannelDto dto, Guid userId)
        {
            await _createValidator.ValidateAndThrowAsync(dto);

            var entity = _mapper.Map<Channel>(dto);
            entity.UserId = userId;
            entity.CreatedBy = userId;
            entity.CreatedAt = DateTime.UtcNow;

            await _repository.AddAsync(entity);
            await _repository.SaveChangesAsync();

            await _notificationProvider.SendInAppNotificationAsync(
                userId,
                "Channel Created",
                $"Your channel '{entity.Name}' has been created successfully.",
                NotificationType.Success,
                true,
                $"User {userId} created a new channel '{entity.Name}'."
            );

            return _mapper.Map<ChannelResponseDto>(entity);
        }

        public async Task<ChannelResponseDto> UpdateAsync(Guid id, UpdateChannelDto dto, Guid userId)
        {
            await _updateValidator.ValidateAndThrowAsync(dto);
            var entity = await _repository.Query()
                .FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId);

            if (entity == null) throw new UnauthorizedAccessException("Invalid Channel selection or access denied.");

            _mapper.Map(dto, entity);
            entity.UpdatedAt = DateTime.UtcNow;

            _repository.Update(entity);
            await _repository.SaveChangesAsync();

            return _mapper.Map<ChannelResponseDto>(entity);
        }

        public async Task<bool> DeleteAsync(Guid id, Guid userId)
        {
            var entity = await _repository.Query()
                .FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId);
            if (entity == null) throw new UnauthorizedAccessException("Invalid Channel selection or access denied.");

            _repository.Remove(entity);
            var isSuccess = await _repository.SaveChangesAsync();
            if (isSuccess)
            {
                await _notificationProvider.SendInAppNotificationAsync(
                    userId,
                    "Channel Deleted",
                    $"Your channel '{entity.Name}' was successfully deleted.",
                    NotificationType.Success
                );
            }
            return isSuccess;
        }

        public async Task<ChannelResponseDto> ConnectChannelAsync(TargetPlatform platform, Guid userId, string authorizationCode, string redirectUri)
        {
            var provider = GetProvider(platform);
            var channel = await provider.AuthenticateAndCreateChannelAsync(userId, authorizationCode, redirectUri);

            // Audit fields
            channel.UserId = userId;
            channel.CreatedBy = userId;
            channel.CreatedAt = DateTime.UtcNow;
            channel.UpdatedAt = DateTime.UtcNow;

            if (channel.ChannelStat != null)
            {
                channel.ChannelStat.CreatedBy = userId;
                channel.ChannelStat.CreatedAt = DateTime.UtcNow;
                channel.ChannelStat.UpdatedAt = DateTime.UtcNow;
            }

            // Check if the channel already exists for this user, platform and platform channel ID
            var existingChannel = await _repository.Query()
                .Include(c => c.ChannelStat)
                .FirstOrDefaultAsync(c => c.Platform == platform && c.PlatformChannelId == channel.PlatformChannelId && c.UserId == userId);

            if (existingChannel != null)
            {
                existingChannel.Name = channel.Name;
                existingChannel.AvatarUrl = channel.AvatarUrl;
                existingChannel.AccessToken = channel.AccessToken;
                existingChannel.RefreshToken = channel.RefreshToken ?? existingChannel.RefreshToken;
                existingChannel.ExpiresAt = channel.ExpiresAt;
                existingChannel.IsConnected = true;
                existingChannel.IsActive = true;
                existingChannel.UpdatedAt = DateTime.UtcNow;

                if (channel.ChannelStat != null)
                {
                    if (existingChannel.ChannelStat != null)
                    {
                        existingChannel.ChannelStat.TotalFollowers = channel.ChannelStat.TotalFollowers;
                        existingChannel.ChannelStat.TotalViews = channel.ChannelStat.TotalViews;
                        existingChannel.ChannelStat.TotalVideos = channel.ChannelStat.TotalVideos;
                        existingChannel.ChannelStat.UpdatedAt = DateTime.UtcNow;
                    }
                    else
                    {
                        existingChannel.ChannelStat = channel.ChannelStat;
                    }
                }

                _repository.Update(existingChannel);
                await _repository.SaveChangesAsync();

                await _notificationProvider.SendInAppNotificationAsync(
                    userId,
                    "Channel Connected",
                    $"Your {platform} channel '{existingChannel.Name}' has been connected successfully.",
                    NotificationType.Success,
                    true,
                    $"User {userId} connected their {platform} channel '{existingChannel.Name}'."
                );

                return _mapper.Map<ChannelResponseDto>(existingChannel);
            }

            await _repository.AddAsync(channel);
            await _repository.SaveChangesAsync();

            await _notificationProvider.SendInAppNotificationAsync(
                userId,
                "Channel Connected",
                $"Your {platform} channel '{channel.Name}' has been connected successfully.",
                NotificationType.Success,
                true,
                $"User {userId} connected their {platform} channel '{channel.Name}'."
            );

            return _mapper.Map<ChannelResponseDto>(channel);
        }

        public async Task SyncChannelMetricsAsync(TargetPlatform platform, Guid channelId, Guid userId)
        {
            var entity = await _repository.Query()
                .FirstOrDefaultAsync(s => s.Id == channelId && s.UserId == userId);
            if (entity == null) throw new UnauthorizedAccessException("Invalid Channel selection or access denied.");
            var provider = GetProvider(platform);
            await provider.SyncMetricsAsync(entity);
        }
        private IChannelPlatformProvider GetProvider(TargetPlatform platform)
        {
            if (!_providers.TryGetValue(platform, out var provider))
            {
                throw new NotSupportedException($"The social platform integration '{platform}' is not currently supported.");
            }
            return provider;
        }
    }
}
