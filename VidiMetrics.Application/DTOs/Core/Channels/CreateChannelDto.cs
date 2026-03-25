using System;

namespace VidiMetrics.Application.DTOs.Core.Channels
{
    public class CreateChannelDto
    {
        public string Name { get; set; }
        public string? YouTubeChannelId { get; set; }
        public string? Description { get; set; }
        public string? CustomUrl { get; set; }
    }
}
