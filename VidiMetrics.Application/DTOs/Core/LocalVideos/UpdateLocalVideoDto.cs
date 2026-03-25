using System;

namespace VidiMetrics.Application.DTOs.Core.LocalVideos
{
    public class UpdateLocalVideoDto
    {
        public string? StorageUrl { get; set; }
        public string? FileExtension { get; set; }
        public long? FileSizeInBytes { get; set; }
        public bool? IsProcessedByAi { get; set; }
        public string? ProcessingError { get; set; }
    }
}
