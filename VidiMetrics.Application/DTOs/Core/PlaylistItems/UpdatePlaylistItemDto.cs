using System;

namespace VidiMetrics.Application.DTOs.Core.PlaylistItems
{
    public class UpdatePlaylistItemDto
    {
        public Guid Id { get; set; }
        public int Position { get; set; }
        public string? Note { get; set; }
        public Guid PlaylistId { get; set; }
        public Guid VideoId { get; set; }
    }
}
