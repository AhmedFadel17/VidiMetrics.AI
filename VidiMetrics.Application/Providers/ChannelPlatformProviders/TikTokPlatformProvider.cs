
using VidiMetrics.Domain.Enums;
using VidiMetrics.Domain.Models.Core;

namespace VidiMetrics.Application.Providers.ChannelPlatformProviders;

public class TikTokPlatformProvider : IChannelPlatformProvider
{
    public TargetPlatform Platform => TargetPlatform.TikTok;


    public Task<Channel> AuthenticateAndCreateChannelAsync(Guid userId, string authorizationCode, string redirectUri)
    {
        throw new NotImplementedException();
    }


    public Task<ChannelStat> SyncMetricsAsync(Channel channel)
    {
        throw new NotImplementedException();
    }


    public Task<string> UploadVideoAsync(Guid channelPostId)
    {
        throw new NotImplementedException();
    }
}
