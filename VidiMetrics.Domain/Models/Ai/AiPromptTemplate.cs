using VidiMetrics.Domain.Enums;

namespace VidiMetrics.Domain.Models.Ai;

public class AiPromptTemplate : BaseEntity
{
    public string Name { get; set; } = string.Empty; 
    public string SystemPrompt { get; set; } = string.Empty; 
    public string UserPromptTemplate { get; set; } = string.Empty; 
    public ModelTarget ModelTarget { get; set; } = ModelTarget.Gpt4o; 
    public double Temperature { get; set; } = 0.7;
}