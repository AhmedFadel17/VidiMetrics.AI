using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Domain.Enums;

namespace VidiMetrics.Application.DTOs.Ai.AiTasks
{
    public record AiTaskResponseDto : BaseResponseDto
    {
        public string TaskType { get; set; } = string.Empty;
        public AiTaskStatus Status { get; set; }
        public string? InputData { get; set; }
        public string? OutputData { get; set; }
        public string? ErrorMessage { get; set; }
        public Guid VideoId { get; set; }
    }
}
