using VidiMetrics.Domain.Enums;

namespace VidiMetrics.Application.DTOs.Core.YouTubeVideos
{
    public class UpdateYouTubeVideoDto
    {
        public Guid? Id { get; set; }
        public string? YouTubeVideoId { get; set; }
        public long? ViewCount { get; set; }
        public long? LikeCount { get; set; }
        public DateTime? PublishedAt { get; set; }
        public YouTubePrivacyStatus? PrivacyStatus { get; set; }
    }
}
