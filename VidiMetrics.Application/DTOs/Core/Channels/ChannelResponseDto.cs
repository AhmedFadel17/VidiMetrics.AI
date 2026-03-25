using System;

namespace VidiMetrics.Application.DTOs.Core.Channels
{
    public class ChannelResponseDto
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? CreatedBy { get; set; }
        public bool IsDeleted { get; set; }
        public string Name { get; set; }
        public string? YouTubeChannelId { get; set; }
        public string? Description { get; set; }
        public string? CustomUrl { get; set; }
    }
}
