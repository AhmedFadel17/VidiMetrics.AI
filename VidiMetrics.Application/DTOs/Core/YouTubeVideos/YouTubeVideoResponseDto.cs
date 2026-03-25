using VidiMetrics.Domain.Enums;

namespace VidiMetrics.Application.DTOs.Core.YouTubeVideos
{
    public class YouTubeVideoResponseDto
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? CreatedBy { get; set; }
        public bool IsDeleted { get; set; }
        public string YouTubeVideoId { get; set; }
        public long ViewCount { get; set; }
        public long LikeCount { get; set; }
        public DateTime PublishedAt { get; set; }
        public YouTubePrivacyStatus? PrivacyStatus { get; set; }
    }
}
