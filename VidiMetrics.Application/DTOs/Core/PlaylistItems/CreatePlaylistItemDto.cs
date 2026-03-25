using System;

namespace VidiMetrics.Application.DTOs.Core.PlaylistItems
{
    public class CreatePlaylistItemDto
    {
        public int Position { get; set; }
        public string? Note { get; set; }
        public Guid PlaylistId { get; set; }
        public Guid VideoId { get; set; }
    }
}
