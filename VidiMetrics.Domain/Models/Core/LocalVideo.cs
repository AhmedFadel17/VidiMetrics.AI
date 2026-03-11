namespace VidiMetrics.Domain.Models.Core;

public class LocalVideo : Video
{
    public string StorageUrl { get; set; } = string.Empty; 
    public string FileExtension { get; set; } = string.Empty; 
    public long FileSizeInBytes { get; set; }
    public bool IsProcessedByAi { get; set; } = false;
    public string? ProcessingError { get; set; }
}