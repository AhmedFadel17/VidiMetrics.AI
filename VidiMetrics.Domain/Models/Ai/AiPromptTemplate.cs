namespace VidiMetrics.Domain.Models.Ai;

public class AiPromptTemplate : BaseEntity
{
    public string Name { get; set; } = string.Empty; 
    public string SystemPrompt { get; set; } = string.Empty; 
    public string UserPromptTemplate { get; set; } = string.Empty; 
    public string ModelTarget { get; set; } = "gpt-4o"; 
    public double Temperature { get; set; } = 0.7;
}