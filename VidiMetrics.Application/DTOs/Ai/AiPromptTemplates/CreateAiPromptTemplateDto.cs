using VidiMetrics.Domain.Enums;

namespace VidiMetrics.Application.DTOs.Ai.AiPromptTemplates
{
    public record CreateAiPromptTemplateDto
    {
        public required string Name { get; set; }
        public required string SystemPrompt { get; set; }
        public required string UserPromptTemplate { get; set; }
        public ModelTarget ModelTarget { get; set; }
        public double Temperature { get; set; }
    }
}
