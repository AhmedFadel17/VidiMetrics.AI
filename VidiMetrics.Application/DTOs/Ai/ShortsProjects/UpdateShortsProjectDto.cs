using VidiMetrics.Domain.Enums;

namespace VidiMetrics.Application.DTOs.Ai.ShortsProjects
{
    public class UpdateShortsProjectDto
    {
        public string ProjectName { get; set; }
        public TargetPlatform TargetPlatform { get; set; }
        public int ExpectedClipCount { get; set; }
        public Guid OriginalVideoId { get; set; }
    }
}
