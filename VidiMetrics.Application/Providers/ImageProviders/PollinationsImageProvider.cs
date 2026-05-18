using Polly;
using Polly.Retry;

namespace VidiMetrics.Application.Providers.ImageProviders;

public class PollinationsImageProvider : IImageProvider
{
    private readonly HttpClient _httpClient;
    private readonly AsyncRetryPolicy _retryPolicy;
    const string BaseUrl = "https://image.pollinations.ai/prompt";
    public PollinationsImageProvider(HttpClient httpClient)
    {
        _httpClient = httpClient;
        _retryPolicy = Policy
            .Handle<HttpRequestException>()
            .Or<TaskCanceledException>()
            .WaitAndRetryAsync(3, retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)));


    }

    public async Task<string> GenerateImageAsync(string prompt, int seed, int width = 1024, int height = 1024)
    {
        if (string.IsNullOrWhiteSpace(prompt))
            throw new ArgumentException("Prompt cannot be empty.", nameof(prompt));

        string encodedPrompt = Uri.EscapeDataString(prompt);
        string url = $"https://image.pollinations.ai/prompt/{encodedPrompt}?seed={seed}&width={width}&height={height}&nologo=true&enhance=true";

        try
        {
            await _retryPolicy.ExecuteAsync(async () =>
            {
                var response = await _httpClient.GetAsync(url);


                if (!response.IsSuccessStatusCode)
                {
                    throw new HttpRequestException($"AI Image provider failed with status code: {response.StatusCode}");
                }


                return response;
            });

            return url;
        }
        catch (Exception ex)
        {
            throw new Exception("An error occurred while communicating with the image generation server.", ex);
        }
    }

}
