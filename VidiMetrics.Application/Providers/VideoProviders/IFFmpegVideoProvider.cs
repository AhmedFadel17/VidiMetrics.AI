using VidiMetrics.Application.DTOs.Ai.AiVideos;

namespace VidiMetrics.Application.Providers.VideoProviders;

public interface IFFmpegVideoProvider
{
    Task<VideoGenerationResult> StitchVideosAsync(List<string> localVideoPaths, int seed, int width = 1024, int height = 1024);
}
