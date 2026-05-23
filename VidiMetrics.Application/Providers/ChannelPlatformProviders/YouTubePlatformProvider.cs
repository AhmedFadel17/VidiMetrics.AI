using System;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Auth.OAuth2.Flows;
using Google.Apis.Auth.OAuth2.Responses;
using Google.Apis.Services;
using Google.Apis.YouTube.v3;
using Google.Apis.YouTube.v3.Data;
using Microsoft.Extensions.Options;
using VidiMetrics.Application.Interfaces;
using VidiMetrics.Domain.Enums;
using VidiMetrics.Domain.Settings;
using CoreModels = VidiMetrics.Domain.Models.Core;

namespace VidiMetrics.Application.Providers.ChannelPlatformProviders
{
    public class YouTubePlatformProvider : IChannelPlatformProvider
    {
        private readonly ApiSettings _settings;

        public TargetPlatform Platform => TargetPlatform.YouTube;

        public YouTubePlatformProvider(IOptions<ApisSettings> apisOptions)
        {
            _settings = apisOptions.Value.YouTube;
        }

        // =========================================================================
        // STEP 1: AUTHENTICATE & EXTRACT METADATA (No Database operations)
        // =========================================================================
        public async Task<CoreModels.Channel> AuthenticateAndCreateChannelAsync(Guid userId, string authorizationCode, string redirectUri)
        {
            var flow = new GoogleAuthorizationCodeFlow(new GoogleAuthorizationCodeFlow.Initializer
            {
                ClientSecrets = new ClientSecrets
                {
                    ClientId = _settings.ClientId,
                    ClientSecret = _settings.ClientSecret
                }
            });

            TokenResponse tokenData = await flow.ExchangeCodeForTokenAsync(
                userId: userId.ToString(),
                code: authorizationCode,
                redirectUri: redirectUri,
                CancellationToken.None
            );

            var youtubeService = GetYouTubeService(tokenData.AccessToken);

            var channelRequest = youtubeService.Channels.List("snippet,statistics");
            channelRequest.Mine = true;
            var channelResponse = await channelRequest.ExecuteAsync();

            var apiChannel = channelResponse.Items.FirstOrDefault();
            if (apiChannel == null)
                throw new Exception("No accessible YouTube profile found for these credentials.");

            // Return a plain data payload object back to the caller Service to save to the DB
            return new CoreModels.Channel
            {
                PlatformChannelId = apiChannel.Id,
                Name = apiChannel.Snippet.Title,
                AvatarUrl = apiChannel.Snippet.Thumbnails.Default__.Url,
                AccessToken = tokenData.AccessToken,
                RefreshToken = tokenData.RefreshToken,
                Platform = TargetPlatform.YouTube,
                ExpiresAt = DateTime.UtcNow.AddSeconds(tokenData.ExpiresInSeconds ?? 3600),

                ChannelStat = new CoreModels.ChannelStat
                {
                    TotalFollowers = apiChannel.Statistics.SubscriberCount.HasValue ? (int)apiChannel.Statistics.SubscriberCount.Value : 0,
                    TotalViews = apiChannel.Statistics.ViewCount.HasValue ? (int)apiChannel.Statistics.ViewCount.Value : 0,
                    TotalVideos = apiChannel.Statistics.VideoCount.HasValue ? (int)apiChannel.Statistics.VideoCount.Value : 0
                }


            };
        }

        // =========================================================================
        // STEP 2: FETCH FRESH METRICS (Returns raw metrics payload)
        // =========================================================================
        public async Task<CoreModels.ChannelStat> SyncMetricsAsync(CoreModels.Channel channel)
        {
            // The service checks token lifetime and calls our internal refresh helper if needed
            var youtubeService = GetYouTubeService(channel?.AccessToken);

            var channelRequest = youtubeService.Channels.List("statistics");
            channelRequest.Mine = true;
            var response = await channelRequest.ExecuteAsync();

            var apiChannel = response.Items.FirstOrDefault();
            if (apiChannel == null)
                throw new Exception("Failed to retrieve metrics from YouTube API backend server.");

            return new CoreModels.ChannelStat
            {
                TotalFollowers = apiChannel.Statistics.SubscriberCount.HasValue ? (int)apiChannel.Statistics.SubscriberCount.Value : 0,
                TotalViews = apiChannel.Statistics.ViewCount.HasValue ? (int)apiChannel.Statistics.ViewCount.Value : 0,
                TotalVideos = apiChannel.Statistics.VideoCount.HasValue ? (int)apiChannel.Statistics.VideoCount.Value : 0
            };
        }

        // =========================================================================
        // STEP 3: UPLOAD VIDEO (Pure network distribution pipeline)
        // =========================================================================
        public async Task<string> UploadVideoAsync(Guid channelPostId)
        {
            throw new NotImplementedException();
        }

        // =========================================================================
        // STEP 4: REFRESH TOKEN ACCESS (Pure API utility method)
        // =========================================================================
        public async Task<TokenRefreshResult> RefreshTokenAsync(string refreshToken, Guid userId)
        {
            var flow = new GoogleAuthorizationCodeFlow(new GoogleAuthorizationCodeFlow.Initializer
            {
                ClientSecrets = new ClientSecrets { ClientId = _settings.ClientId, ClientSecret = _settings.ClientSecret }
            });

            TokenResponse renewedToken = await flow.RefreshTokenAsync(userId.ToString(), refreshToken, CancellationToken.None);

            return new TokenRefreshResult
            {
                AccessToken = renewedToken.AccessToken,
                ExpiresAt = DateTime.UtcNow.AddSeconds(renewedToken.ExpiresInSeconds ?? 3600)
            };
        }

        private YouTubeService GetYouTubeService(string accessToken)
        {
            return new YouTubeService(new BaseClientService.Initializer
            {
                HttpClientInitializer = GoogleCredential.FromAccessToken(accessToken),
                ApplicationName = "VidiMetrics"
            });
        }

        public record TokenRefreshResult
        {
            public string AccessToken { get; set; } = string.Empty;
            public DateTime ExpiresAt { get; set; }
        }
    }
}