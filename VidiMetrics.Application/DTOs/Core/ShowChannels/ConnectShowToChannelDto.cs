namespace VidiMetrics.Application.DTOs.Core.ShowChannels;

public record ConnectShowToChannelDto
{
    public Guid ShowId { get; set; }
    public Guid ChannelId { get; set; }
}
