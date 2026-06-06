namespace VidiMetrics.Application.DTOs.Ai.AiImages;

public record CreateEnvironmentImageDto
{
    public required string Name { get; set; }

    public required string VisualDescription { get; set; }

    public required string Atmosphere { get; set; }

}
