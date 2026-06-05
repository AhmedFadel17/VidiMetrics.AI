using VidiMetrics.Application.DTOs.Ai.AiImages;

namespace VidiMetrics.Application.Providers.ImageProviders;

public interface IImageProvider
{
    Task<ImageGenerationResult> GenerateImageAsync(string prompt, int seed, int width = 1024, int height = 1024);
}
