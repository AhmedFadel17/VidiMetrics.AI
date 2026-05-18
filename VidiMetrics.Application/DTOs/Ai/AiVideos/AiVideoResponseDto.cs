using System;

namespace VidiMetrics.Application.DTOs.Ai.AiVideos
{
    public class AiVideoResponseDto
    {
        public Guid Id { get; set; }
        public string? VideoUrl { get; set; }
        public string? ThumbnailUrl { get; set; }
        public TimeSpan Duration { get; set; }
        public long Seed { get; set; }
        public bool IsLinked { get; set; }
        public Guid UserId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
