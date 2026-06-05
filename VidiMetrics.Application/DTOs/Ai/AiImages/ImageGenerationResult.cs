namespace VidiMetrics.Application.DTOs.Ai.AiImages;

public record ImageGenerationResult
{
    public string ImageUrl { get; set; } = string.Empty;
    public long SizeInBytes { get; set; }
}
