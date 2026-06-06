using VidiMetrics.Domain.Enums;

namespace VidiMetrics.Application.DTOs.Ai.AiPromptTemplates
{
    public record UpdateAiPromptTemplateDto
    {
        public string? Name { get; set; }
        public string? SystemPrompt { get; set; }
        public string? UserPromptTemplate { get; set; }
        public ModelTarget? ModelTarget { get; set; }
        public double? Temperature { get; set; }
    }
}
