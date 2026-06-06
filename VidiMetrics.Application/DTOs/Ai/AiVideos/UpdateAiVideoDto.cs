using VidiMetrics.Domain.Enums;

namespace VidiMetrics.Application.DTOs.Ai.AiVideos
{
    public record UpdateAiVideoDto
    {
        public string? VideoUrl { get; set; }
        public string? ThumbnailUrl { get; set; }
        public TimeSpan? Duration { get; set; }
        public bool? IsLinked { get; set; }
        public AssetType? AssetType { get; set; }
        public long? Size { get; set; }
        public long? Seed { get; set; }
    }
}
