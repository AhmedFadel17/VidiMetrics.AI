using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Polly;
using Polly.Retry;
using VidiMetrics.Application.Interfaces;
using VidiMetrics.Domain.Enums;
using VidiMetrics.Domain.Models.Core;
using VidiMetrics.Domain.Settings;

namespace VidiMetrics.Application.Providers.ChannelPlatformProviders;

public class TikTokPlatformProvider : IChannelPlatformProvider
{
    private readonly ApiSettings _settings;
    private readonly AsyncRetryPolicy<HttpResponseMessage> _httpRetryPolicy;
    private readonly HttpClient _httpClient;

    public TargetPlatform Platform => TargetPlatform.TikTok;

    public TikTokPlatformProvider(IOptions<ApisSettings> apisOptions)
    {
        _settings = apisOptions.Value.TikTok;
        _httpClient = new HttpClient();

        _httpRetryPolicy = Policy
            .HandleResult<HttpResponseMessage>(r => r.StatusCode == HttpStatusCode.TooManyRequests || (int)r.StatusCode >= 500)
            .WaitAndRetryAsync(3, retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)));
    }

    public async Task<Channel> AuthenticateAndCreateChannelAsync(Guid userId, string authorizationCode, string redirectUri)
    {
        var response = await _httpRetryPolicy.ExecuteAsync(async () =>
        {
            var requestBody = new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string, string>("client_key", _settings.ClientId),
                new KeyValuePair<string, string>("client_secret", _settings.ClientSecret),
                new KeyValuePair<string, string>("code", authorizationCode),
                new KeyValuePair<string, string>("grant_type", "authorization_code"),
                new KeyValuePair<string, string>("redirect_uri", redirectUri)
            });

            using var tokenRequest = new HttpRequestMessage(HttpMethod.Post, _settings.AuthUrl)
            {
                Content = requestBody
            };
            tokenRequest.Headers.Add("Cache-Control", "no-cache");

            return await _httpClient.SendAsync(tokenRequest);
        });

        response.EnsureSuccessStatusCode();

        string rawResponse = await response.Content.ReadAsStringAsync();
        await HandleAndThrowOnTikTokErrorAsync(rawResponse);

        var tokenData = JsonSerializer.Deserialize<TikTokTokenData>(rawResponse);

        if (tokenData == null || string.IsNullOrEmpty(tokenData.AccessToken))
        {
            throw new Exception("Failed to extract token data from TikTok envelope. Response structural mismatch.");
        }

        var profileUrl = $"{_settings.BaseUrl.TrimEnd('/')}/user/info/?fields=open_id,union_id,avatar_url,display_name,follower_count,likes_count,video_count";
        var profileResponse = await _httpRetryPolicy.ExecuteAsync(async () =>
        {
            using var profileRequest = new HttpRequestMessage(HttpMethod.Get, profileUrl);
            profileRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", tokenData.AccessToken);
            return await _httpClient.SendAsync(profileRequest);
        });

        profileResponse.EnsureSuccessStatusCode();


        string rawProfileResponse = await profileResponse.Content.ReadAsStringAsync();
        await HandleAndThrowOnTikTokErrorAsync(rawProfileResponse);

        var profileWrapper = JsonSerializer.Deserialize<TikTokUserResponseWrapper>(rawProfileResponse);
        var userData = profileWrapper?.Data?.User ?? throw new Exception("Could not parse profile info from TikTok payload.");

        return new Channel
        {
            PlatformChannelId = userData.OpenId,
            Name = string.IsNullOrEmpty(userData.DisplayName) ? userData.Username : userData.DisplayName,
            AvatarUrl = userData.AvatarUrl,
            AccessToken = tokenData.AccessToken,
            RefreshToken = tokenData.RefreshToken,
            Platform = TargetPlatform.TikTok,
            ExpiresAt = DateTime.UtcNow.AddSeconds(tokenData.ExpiresIn),

            ChannelStat = new ChannelStat
            {
                TotalFollowers = userData.FollowerCount,
                TotalViews = userData.LikesCount,
                TotalVideos = userData.VideoCount
            }
        };
    }

    public Task<ChannelStat> SyncMetricsAsync(Channel channel)
    {
        throw new NotImplementedException();
    }

    public async Task<ChannelStat> SyncMetricsAsync(string accessToken, string refreshToken, Guid userId)
    {
        var profileUrl = $"{_settings.BaseUrl.TrimEnd('/')}/user/info/?fields=follower_count,likes_count,video_count";

        var response = await _httpRetryPolicy.ExecuteAsync(async () =>
        {
            using var request = new HttpRequestMessage(HttpMethod.Get, profileUrl);
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
            return await _httpClient.SendAsync(request);
        });

        response.EnsureSuccessStatusCode();

        string rawResponse = await response.Content.ReadAsStringAsync();
        await HandleAndThrowOnTikTokErrorAsync(rawResponse);

        var profileWrapper = JsonSerializer.Deserialize<TikTokUserResponseWrapper>(rawResponse);
        var userData = profileWrapper?.Data?.User ?? throw new Exception("Could not parse sync profile metrics info from TikTok.");

        return new ChannelStat
        {
            TotalFollowers = userData.FollowerCount,
            TotalViews = userData.LikesCount,
            TotalVideos = userData.VideoCount
        };
    }

    public Task<string> UploadVideoAsync(Guid channelPostId)
    {
        throw new NotImplementedException();
    }

    public async Task<TokenRefreshResult> RefreshTokenAsync(string refreshToken, Guid userId)
    {
        var response = await _httpRetryPolicy.ExecuteAsync(async () =>
        {
            var requestBody = new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string, string>("client_key", _settings.ClientId),
                new KeyValuePair<string, string>("client_secret", _settings.ClientSecret),
                new KeyValuePair<string, string>("grant_type", "refresh_token"),
                new KeyValuePair<string, string>("refresh_token", refreshToken)
            });
            return await _httpClient.PostAsync(_settings.AuthUrl, requestBody);
        });

        response.EnsureSuccessStatusCode();

        string rawResponse = await response.Content.ReadAsStringAsync();
        await HandleAndThrowOnTikTokErrorAsync(rawResponse);

        var tokenData = JsonSerializer.Deserialize<TikTokTokenData>(rawResponse);

        if (tokenData == null)
            throw new Exception("Corrupted token mapping structure during refresh cycle.");

        return new TokenRefreshResult
        {
            AccessToken = tokenData.AccessToken,
            ExpiresAt = DateTime.UtcNow.AddSeconds(tokenData.ExpiresIn)
        };
    }


    private async Task HandleAndThrowOnTikTokErrorAsync(string rawJsonContent)
    {
        if (string.IsNullOrWhiteSpace(rawJsonContent)) return;

        using var jsonDocument = JsonDocument.Parse(rawJsonContent);
        var root = jsonDocument.RootElement;

        if (root.TryGetProperty("error", out var errorElement))
        {
            if (errorElement.ValueKind == JsonValueKind.Object)
            {
                var code = errorElement.TryGetProperty("code", out var c) ? c.GetString() : string.Empty;
                var message = errorElement.TryGetProperty("message", out var m) ? m.GetString() : string.Empty;
                var logId = root.TryGetProperty("log_id", out var l) ? l.GetString() : string.Empty;

                if (!string.IsNullOrEmpty(code) && code != "ok" && code != "0")
                {
                    throw new Exception($"TikTok API Gateway Error Code: [{code}]. Context message: '{message}'. Trace ID: {logId}");
                }
            }
            else if (errorElement.ValueKind == JsonValueKind.String)
            {
                var errorType = errorElement.GetString();


                if (!string.IsNullOrEmpty(errorType) && errorType != "ok" && errorType != "success")
                {
                    var description = root.TryGetProperty("error_description", out var d) ? d.GetString() : "No detailed description supplied.";
                    var logId = root.TryGetProperty("log_id", out var l) ? l.GetString() : string.Empty;

                    throw new Exception($"TikTok OAuth Verification Error: [{errorType}]. Description: '{description}'. Log Trace ID: {logId}");
                }
            }
        }
    }
}

public record TokenRefreshResult
{
    public string AccessToken { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
}


internal record TikTokTokenData(
    [property: System.Text.Json.Serialization.JsonPropertyName("access_token")] string AccessToken,
    [property: System.Text.Json.Serialization.JsonPropertyName("refresh_token")] string RefreshToken,
    [property: System.Text.Json.Serialization.JsonPropertyName("expires_in")] int ExpiresIn,
    [property: System.Text.Json.Serialization.JsonPropertyName("open_id")] string OpenId
);

internal record TikTokUserResponseWrapper([property: System.Text.Json.Serialization.JsonPropertyName("data")] TikTokUserDataNode? Data);
internal record TikTokUserDataNode([property: System.Text.Json.Serialization.JsonPropertyName("user")] TikTokUserProperties? User);
internal record TikTokUserProperties(
    [property: System.Text.Json.Serialization.JsonPropertyName("open_id")] string OpenId,
    [property: System.Text.Json.Serialization.JsonPropertyName("union_id")] string UnionId,
    [property: System.Text.Json.Serialization.JsonPropertyName("display_name")] string DisplayName,
    [property: System.Text.Json.Serialization.JsonPropertyName("avatar_url")] string AvatarUrl,
    [property: System.Text.Json.Serialization.JsonPropertyName("username")] string Username,
    [property: System.Text.Json.Serialization.JsonPropertyName("follower_count")] int FollowerCount,
    [property: System.Text.Json.Serialization.JsonPropertyName("likes_count")] int LikesCount,
    [property: System.Text.Json.Serialization.JsonPropertyName("video_count")] int VideoCount
);