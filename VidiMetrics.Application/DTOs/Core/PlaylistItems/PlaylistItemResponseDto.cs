using System;

namespace VidiMetrics.Application.DTOs.Core.PlaylistItems
{
    public class PlaylistItemResponseDto
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? CreatedBy { get; set; }
        public bool IsDeleted { get; set; }
        public int Position { get; set; }
        public string? Note { get; set; }
        public Guid PlaylistId { get; set; }
        public Guid VideoId { get; set; }
    }
}
