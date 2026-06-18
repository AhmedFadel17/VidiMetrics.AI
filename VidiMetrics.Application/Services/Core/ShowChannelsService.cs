using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using VidiMetrics.Application.DTOs.Core.ShowChannels;
using VidiMetrics.Application.Interfaces.Core;
using VidiMetrics.DataAccess.Repositories;
using VidiMetrics.Domain.Models.Core;
using VidiMetrics.Domain.Models.StoryEngine;

namespace VidiMetrics.Application.Services.Core
{
    public class ShowChannelsService : IShowChannelsService
    {
        private readonly IBaseRepository<ShowChannel> _showChannelRepository;
        private readonly IBaseRepository<Show> _showRepository;
        private readonly IBaseRepository<Channel> _channelRepository;
        private readonly IMapper _mapper;
        public ShowChannelsService(
            IBaseRepository<ShowChannel> showChannelRepository,
            IBaseRepository<Show> showRepository,
            IBaseRepository<Channel> channelRepository,
            IMapper mapper)
        {
            _showChannelRepository = showChannelRepository;
            _showRepository = showRepository;
            _channelRepository = channelRepository;
            _mapper = mapper;
        }

        public async Task<bool> ConnectShowToChannelAsync(Guid userId, Guid showId, Guid channelId, CancellationToken ct = default)
        {

            var showExists = await _showRepository.Query().AnyAsync(s => s.Id == showId && s.UserId == userId, ct);
            if (!showExists) throw new Exception("Show not found or access denied.");

            var channelExists = await _channelRepository.Query().AnyAsync(c => c.Id == channelId && c.UserId == userId, ct);
            if (!channelExists) throw new Exception("Channel not found or access denied.");

            var existing = await _showChannelRepository.Query()
                .FirstOrDefaultAsync(sc => sc.ShowId == showId && sc.ChannelId == channelId && !sc.IsDeleted, ct);

            if (existing != null)
            {
                return true; // Already connected
            }


            var showChannel = new ShowChannel
            {
                Id = Guid.NewGuid(),
                ShowId = showId,
                ChannelId = channelId,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = userId
            };

            await _showChannelRepository.AddAsync(showChannel, ct);
            return await _showChannelRepository.SaveChangesAsync(ct);
        }

        public async Task<bool> DisconnectShowFromChannelAsync(Guid userId, Guid showId, Guid channelId, CancellationToken ct = default)
        {
            var showChannel = await _showChannelRepository.Query()
                .FirstOrDefaultAsync(sc => sc.ShowId == showId && sc.ChannelId == channelId && sc.Show.UserId == userId, ct);

            if (showChannel == null)
            {
                return false;
            }

            _showChannelRepository.Remove(showChannel);
            return await _showChannelRepository.SaveChangesAsync(ct);
        }

        public async Task<List<ShowChannelResponseDto>> GetShowChannelsAsync(Guid userId, Guid showId, CancellationToken ct = default)
        {
            var showChannels = await _showChannelRepository.Query()
                .Include(sc => sc.Channel)
                .Where(sc => sc.ShowId == showId && sc.Show.UserId == userId && !sc.IsDeleted)
                .ToListAsync(ct);
            return _mapper.Map<List<ShowChannelResponseDto>>(showChannels);
        }

        public async Task<bool> UpdateShowChannelSettingsAsync(Guid userId, Guid showChannelId, UpdateShowChannelSettingsDto dto, CancellationToken ct = default)
        {
            var showChannel = await _showChannelRepository.Query()
                .FirstOrDefaultAsync(sc => sc.Id == showChannelId && sc.Show.UserId == userId, ct);

            if (showChannel == null)
            {
                throw new Exception("Show channel configuration not found or access denied.");
            }

            var updatedShowChannel = _mapper.Map(dto, showChannel);
            updatedShowChannel.UpdatedAt = DateTime.UtcNow;


            _showChannelRepository.Update(updatedShowChannel);
            return await _showChannelRepository.SaveChangesAsync(ct);
        }
    }
}
