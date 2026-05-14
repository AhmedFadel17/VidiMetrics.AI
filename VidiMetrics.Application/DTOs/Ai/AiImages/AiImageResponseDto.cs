namespace VidiMetrics.Application.DTOs.Ai.AiImages;

public class AiImageResponseDto
{
    public Guid Id { get; set; }
    public string? ImageUrl { get; set; }
    public string? Prompt { get; set; }
    public long Seed { get; set; }
    public bool IsLinked { get; set; }
    public Guid UserId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
