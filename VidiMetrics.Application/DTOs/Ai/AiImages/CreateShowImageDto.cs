namespace VidiMetrics.Application.DTOs.Ai.AiImages;

public class CreateShowImageDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string VisualStyle { get; set; } = string.Empty;
    public string TargetAudience { get; set; } = string.Empty;
}
