namespace VidiMetrics.Application.DTOs.Ai.AiImages;

public record CreateLocationImageDto
{
    public required string Name { get; set; }

    public required string VisualDescription { get; set; }

    public required string Atmosphere { get; set; }

}
