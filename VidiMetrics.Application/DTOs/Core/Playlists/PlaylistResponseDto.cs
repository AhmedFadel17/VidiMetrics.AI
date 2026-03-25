using System;

namespace VidiMetrics.Application.DTOs.Core.Playlists
{
    public class PlaylistResponseDto
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? CreatedBy { get; set; }
        public bool IsDeleted { get; set; }
        public string Title { get; set; }
        public string? Description { get; set; }
        public string? YouTubePlaylistId { get; set; }
        public Guid ChannelId { get; set; }
    }
}
