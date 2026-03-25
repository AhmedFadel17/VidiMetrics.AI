using System;

namespace VidiMetrics.Application.DTOs.Core.Playlists
{
    public class UpdatePlaylistDto
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? YouTubePlaylistId { get; set; }
        public Guid? ChannelId { get; set; }
    }
}
