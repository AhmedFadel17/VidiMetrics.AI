using VidiMetrics.Application.DTOs.Ai.AiVideos;

namespace VidiMetrics.Application.Providers.VideoProviders;

public interface IVideoProvider
{
    Task<VideoGenerationResult> GenerateVideoAsync(string prompt, int seed, int width = 1024, int height = 1024);
}


