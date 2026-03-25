using VidiMetrics.Domain.Enums;

namespace VidiMetrics.Application.DTOs.Ai.AiPromptTemplates
{
    public class AiPromptTemplateResponseDto
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? CreatedBy { get; set; }
        public bool IsDeleted { get; set; }
        public string Name { get; set; }
        public string SystemPrompt { get; set; }
        public string UserPromptTemplate { get; set; }
        public ModelTarget ModelTarget { get; set; }
        public double Temperature { get; set; }
    }
}
