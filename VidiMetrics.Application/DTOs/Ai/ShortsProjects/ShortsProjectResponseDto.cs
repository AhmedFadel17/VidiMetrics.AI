using VidiMetrics.Domain.Enums;

namespace VidiMetrics.Application.DTOs.Ai.ShortsProjects
{
    public class ShortsProjectResponseDto
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? CreatedBy { get; set; }
        public bool IsDeleted { get; set; }
        public string ProjectName { get; set; }
        public TargetPlatform TargetPlatform { get; set; }
        public int ExpectedClipCount { get; set; }
        public Guid OriginalVideoId { get; set; }
    }
}
