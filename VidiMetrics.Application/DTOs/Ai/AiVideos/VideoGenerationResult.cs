namespace VidiMetrics.Application.DTOs.Ai.AiVideos;

public class VideoGenerationResult
{
    public string VideoUrl { get; set; } = string.Empty;
    public string ThumbnailUrl { get; set; } = string.Empty;
    public TimeSpan Duration { get; set; }
    public long SizeInBytes { get; set; }
}
