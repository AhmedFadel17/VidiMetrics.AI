namespace VidiMetrics.Application.DTOs.Ai.AiImages;

public class UpdateAiImageDto
{
    public string? ImageUrl { get; set; }
    public string? Prompt { get; set; }
    public long? Seed { get; set; }
    public bool? IsLinked { get; set; }
}
