using System.Net.Http.Headers;
using Microsoft.Extensions.Options;
using Polly;
using Polly.Retry;
using VidiMetrics.Application.DTOs.Ai.AiImages;
using VidiMetrics.Application.Providers.StorageProviders;
using VidiMetrics.Domain.Settings;

namespace VidiMetrics.Application.Providers.ImageProviders;

public class PollinationsImageProvider : IImageProvider
{
    private readonly HttpClient _httpClient;
    private readonly AsyncRetryPolicy _retryPolicy;
    private readonly ApiSettings _settings;
    private readonly IStorageProvider _storageProvider;


    public PollinationsImageProvider(HttpClient httpClient, IOptions<ApisSettings> options, IStorageProvider storageProvider)
    {
        _httpClient = httpClient;
        _settings = options.Value.Pollinations;
        _storageProvider = storageProvider;
        if (string.IsNullOrWhiteSpace(_settings.ApiKey))
        {
            throw new ArgumentNullException(nameof(_settings.ApiKey), "Pollinations API Key is missing.");
        }

        _httpClient.Timeout = TimeSpan.FromMinutes(3);

        _retryPolicy = Policy
    .Handle<HttpRequestException>()
    .Or<TaskCanceledException>()
            .WaitAndRetryAsync(3, retryAttempt =>
                TimeSpan.FromSeconds(10 + new Random().Next(1, 5)));
    }

    public async Task<ImageGenerationResult> GenerateImageAsync(string prompt, int seed, int width = 1024, int height = 1024)
    {
        if (string.IsNullOrWhiteSpace(prompt))
            throw new ArgumentException("Prompt cannot be empty.", nameof(prompt));

        string encodedPrompt = Uri.EscapeDataString(prompt);
        string targetUrl = $"{_settings.BaseUrl}/image/{encodedPrompt}?seed={seed}&width={width}&height={height}&nologo=true&enhance=true";

        byte[] imageBytes;

        try
        {
            // 1. ONLY retry the external AI generation endpoint network request
            imageBytes = await _retryPolicy.ExecuteAsync(async () =>
            {
                var request = new HttpRequestMessage(HttpMethod.Get, targetUrl);
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _settings.ApiKey);
                request.Headers.TryAddWithoutValidation("Accept", "image/jpeg, image/png");
                var response = await _httpClient.SendAsync(request, HttpCompletionOption.ResponseContentRead);

                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    throw new HttpRequestException($"AI Image provider failed: {response.StatusCode} - {errorContent}");
                }

                var bytes = await response.Content.ReadAsByteArrayAsync();

                // Guard against empty payloads
                if (bytes == null || bytes.Length < 1024)
                {
                    throw new HttpRequestException("Received an incomplete or empty image buffer from provider. Retrying...");
                }

                return bytes;
            });
        }
        catch (Exception ex)
        {
            throw new Exception($"An error occurred while communicating with the image generation server. {ex.Message}", ex);
        }

        // 2. Upload to storage safely OUTSIDE the retry policy.
        try
        {
            string fileName = $"image_{seed}_{Guid.NewGuid().ToString()[..8]}.png";
            string cloudImageUrl = await _storageProvider.UploadImageAsync(imageBytes, fileName);

            return new ImageGenerationResult
            {
                ImageUrl = cloudImageUrl,
                SizeInBytes = imageBytes.Length
            };
        }
        catch (Exception ex)
        {
            throw new Exception($"Image generated successfully, but saving to cloud storage failed: {ex.Message}", ex);
        }
    }
}
