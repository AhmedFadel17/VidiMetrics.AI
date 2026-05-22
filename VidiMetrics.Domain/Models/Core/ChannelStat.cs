using System.ComponentModel.DataAnnotations.Schema;
using VidiMetrics.Domain.Enums;
using VidiMetrics.Domain.Models.Infra;

namespace VidiMetrics.Domain.Models.Core;

public class ChannelStat : BaseEntity
{
    public int TotalViews { get; set; } = 0;
    public int TotalVideos { get; set; } = 0;
    public int TotalFollowers { get; set; } = 0;
    public int TotalLikes { get; set; } = 0;

    public Guid ChannelId { get; set; }
    [ForeignKey("ChannelId")]
    public Channel Channel { get; set; } = null!;
}