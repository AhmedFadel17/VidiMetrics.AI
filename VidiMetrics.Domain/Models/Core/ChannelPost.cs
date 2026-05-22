using System.ComponentModel.DataAnnotations.Schema;
using VidiMetrics.Domain.Enums;
using VidiMetrics.Domain.Models.Infra;

namespace VidiMetrics.Domain.Models.Core;

public class ChannelPost : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ThumbnailUrl { get; set; } = string.Empty;
    public string VideoUrl { get; set; } = string.Empty;
    public DateTime? PublishedAt { get; set; }
    public DateTime? ScheduledAt { get; set; }
    public string? ExternalPostId { get; set; }
    public PostStatus Status { get; set; } = PostStatus.Draft;
    public string? ErrorMessage { get; set; }

    public Guid ChannelId { get; set; }
    [ForeignKey("ChannelId")]
    public Channel Channel { get; set; } = null!;
}