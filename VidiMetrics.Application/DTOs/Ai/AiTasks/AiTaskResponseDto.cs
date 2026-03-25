using VidiMetrics.Domain.Enums;

namespace VidiMetrics.Application.DTOs.Ai.AiTasks
{
    public class AiTaskResponseDto
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? CreatedBy { get; set; }
        public bool IsDeleted { get; set; }
        public string TaskType { get; set; }
        public AiTaskStatus Status { get; set; }
        public string? InputData { get; set; }
        public string? OutputData { get; set; }
        public string? ErrorMessage { get; set; }
        public Guid VideoId { get; set; }
    }
}
