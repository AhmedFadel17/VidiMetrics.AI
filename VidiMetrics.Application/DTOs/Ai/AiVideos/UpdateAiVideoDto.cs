namespace VidiMetrics.Application.DTOs.Ai.AiVideos
{
    public class UpdateAiVideoDto
    {
        public string? VideoUrl { get; set; }
        public string? ThumbnailUrl { get; set; }
        public TimeSpan? Duration { get; set; }
        public bool IsLinked { get; set; }
    }
}
