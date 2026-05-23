using VidiMetrics.Domain.Enums;
using VidiMetrics.Domain.Models.Core;

namespace VidiMetrics.Application.Providers.ChannelPlatformProviders;

public interface IChannelPlatformProvider
{
    TargetPlatform Platform { get; }
    Task<Channel> AuthenticateAndCreateChannelAsync(Guid userId, string authorizationCode, string redirectUri);
    Task<ChannelStat> SyncMetricsAsync(Channel channel);
    Task<string> UploadVideoAsync(Guid channelPostId);
}
