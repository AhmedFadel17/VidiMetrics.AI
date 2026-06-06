using VidiMetrics.Domain.Enums;

namespace VidiMetrics.Application.DTOs.Ai.AiPromptTemplates
{
    public record AiPromptTemplateResponseDto
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? CreatedBy { get; set; }
        public bool IsDeleted { get; set; }
        public string Name { get; set; } = string.Empty;
        public string SystemPrompt { get; set; } = string.Empty;
        public string UserPromptTemplate { get; set; } = string.Empty;
        public ModelTarget ModelTarget { get; set; }
        public double Temperature { get; set; }
    }
}
