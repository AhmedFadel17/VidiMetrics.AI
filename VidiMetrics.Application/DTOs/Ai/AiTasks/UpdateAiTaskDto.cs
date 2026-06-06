using VidiMetrics.Domain.Enums;

namespace VidiMetrics.Application.DTOs.Ai.AiTasks
{
    public record UpdateAiTaskDto
    {
        public string? TaskType { get; set; }
        public AiTaskStatus? Status { get; set; }
        public string? InputData { get; set; }
        public string? OutputData { get; set; }
        public string? ErrorMessage { get; set; }
        public Guid? VideoId { get; set; }
    }
}
