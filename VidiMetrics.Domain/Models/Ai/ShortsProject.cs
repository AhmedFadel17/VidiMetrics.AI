using VidiMetrics.Domain.Enums;
using VidiMetrics.Domain.Models.Core;

namespace VidiMetrics.Domain.Models.Ai;

public class ShortsProject : BaseEntity
{
    public string ProjectName { get; set; } = string.Empty;
    public TargetPlatform TargetPlatform { get; set; } = TargetPlatform.YouTubeShorts; 
    public int ExpectedClipCount { get; set; }

    public Guid OriginalVideoId { get; set; }
    public Video OriginalVideo { get; set; } = null!;

    public ICollection<LocalVideo> GeneratedClips { get; set; } = new List<LocalVideo>();
}