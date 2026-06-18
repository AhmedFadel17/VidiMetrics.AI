using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Application.DTOs.Core.ChannelPosts;
using VidiMetrics.Domain.Models.Core;

namespace VidiMetrics.Application.Interfaces.Core;

public interface IChannelPostsService
{
    Task<ChannelPostResponseDto> GetByIdAsync(Guid id, Guid userId);
    Task<PaginationResponseDto<ChannelPostResponseDto>> GetAllAsync(ChannelPostFilterDto filter, Guid userId);
    Task<ChannelPostResponseDto> CreateAsync(CreateChannelPostDto dto, Guid userId);
    Task<ChannelPostResponseDto> UpdateAsync(Guid id, UpdateChannelPostDto dto, Guid userId);
    Task<bool> DeleteAsync(Guid id, Guid userId);

    Task<ChannelPostResponseDto> CreateDraftPostForEpisodeAsync(Guid userId, Guid channelId, Guid episodeId, DateTime? scheduledAt, CancellationToken ct = default);
    Task<ChannelPostResponseDto> CreateDraftPostForSceneAsync(Guid userId, Guid channelId, Guid sceneId, DateTime? scheduledAt, CancellationToken ct = default);
    Task<bool> PublishPostAsync(Guid userId, Guid channelPostId, CancellationToken ct = default);
    Task<bool> SchedulePostAsync(Guid userId, Guid channelPostId, DateTime scheduledAt, CancellationToken ct = default);

}
