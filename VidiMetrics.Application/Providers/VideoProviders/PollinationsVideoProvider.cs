using System;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Polly;
using Polly.Retry;
using VidiMetrics.Application.DTOs.Ai.AiVideos;
using VidiMetrics.Application.Providers.StorageProviders;
using VidiMetrics.Domain.Settings;

namespace VidiMetrics.Application.Providers.VideoProviders;

public class PollinationsVideoProvider : IVideoProvider
{
    private readonly HttpClient _httpClient;
    private readonly AsyncRetryPolicy _retryPolicy;
    private readonly PollinationsApiSettings _settings;
    private readonly IStorageProvider _storageProvider;
    private const string BaseUrl = "https://gen.pollinations.ai/video";

    public PollinationsVideoProvider(
        HttpClient httpClient,
        IOptions<PollinationsApiSettings> options,
        IStorageProvider storageProvider)
    {
        _httpClient = httpClient;
        _settings = options.Value;
        _storageProvider = storageProvider;

        if (string.IsNullOrWhiteSpace(_settings.ApiKey))
        {
            throw new ArgumentNullException(nameof(_settings.ApiKey), "Pollinations API Key is missing.");
        }

        // نرفع الـ Timeout الخاص بالـ HttpClient ليعطي السيرفر وقته الكامل في الرندرة السينمائية
        _httpClient.Timeout = TimeSpan.FromMinutes(3);

        _retryPolicy = Policy
            .Handle<HttpRequestException>()
            .Or<TaskCanceledException>()
            .WaitAndRetryAsync(3, retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)));
    }

    public async Task<VideoGenerationResult> GenerateVideoAsync(string prompt, int seed, int width = 1024, int height = 1024)
    {
        if (string.IsNullOrWhiteSpace(prompt))
            throw new ArgumentException("Prompt cannot be empty.", nameof(prompt));

        string encodedPrompt = Uri.EscapeDataString(prompt);
        string targetUrl = $"{BaseUrl}/{encodedPrompt}?seed={seed}&width={width}&height={height}&model=ltx-2&audio=true";

        var result = new VideoGenerationResult();

        try
        {
            await _retryPolicy.ExecuteAsync(async () =>
            {
                var request = new HttpRequestMessage(HttpMethod.Get, targetUrl);
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _settings.ApiKey);
                request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("video/mp4"));

                var response = await _httpClient.SendAsync(request, HttpCompletionOption.ResponseContentRead);

                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    throw new HttpRequestException($"AI Video provider failed: {response.StatusCode} - {errorContent}");
                }

                byte[] videoBytes = await response.Content.ReadAsByteArrayAsync();

                if (videoBytes.Length < 100000)

                {
                    throw new HttpRequestException("Received an incomplete video buffer from provider. Retrying...");
                }

                string fileName = $"video_{seed}_{Guid.NewGuid().ToString().Substring(0, 8)}.mp4";

                string cloudVideoUrl = await _storageProvider.UploadVideoAsync(videoBytes, fileName);

                result.VideoUrl = cloudVideoUrl;
                result.ThumbnailUrl = cloudVideoUrl.Replace(".mp4", ".jpg");
                result.Duration = TimeSpan.FromSeconds(5);

                return response;
            });

            return result;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            throw new Exception($"An error occurred during video generation workflow: {ex.Message}", ex);
        }
    }
}