using VidiMetrics.Domain.Enums;

using VidiMetrics.Domain.Models.StoryEngine;

namespace VidiMetrics.Domain.Models.Ai
{
    public class AiVideo : BaseEntity
    {
        public string VideoUrl { get; set; } = string.Empty;
        public string? ThumbnailUrl { get; set; }
        public TimeSpan Duration { get; set; }
        public long Seed { get; set; }
        public Guid UserId { get; set; }
        public long Size { get; set; }
        public AssetType AssetType { get; set; } = AssetType.Unlinked;
        public bool IsLinked { get; set; } = false;
    }
}
