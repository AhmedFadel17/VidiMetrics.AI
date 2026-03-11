using VidiMetrics.Domain.Models.Core;

namespace VidiMetrics.Domain.Models.Ai;

public class AiTask : BaseEntity
{
    public string TaskType { get; set; } = string.Empty; 
    public string Status { get; set; } = "Pending"; 
    public string? InputData { get; set; } 
    public string? OutputData { get; set; } 
    public string? ErrorMessage { get; set; }

    public Guid VideoId { get; set; }
    public Video Video { get; set; } = null!;
}