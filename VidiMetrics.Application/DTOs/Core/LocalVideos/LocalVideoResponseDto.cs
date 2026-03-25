using System;

namespace VidiMetrics.Application.DTOs.Core.LocalVideos
{
    public class LocalVideoResponseDto
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? CreatedBy { get; set; }
        public bool IsDeleted { get; set; }
        public string StorageUrl { get; set; }
        public string FileExtension { get; set; }
        public long FileSizeInBytes { get; set; }
        public bool IsProcessedByAi { get; set; }
        public string? ProcessingError { get; set; }
    }
}
