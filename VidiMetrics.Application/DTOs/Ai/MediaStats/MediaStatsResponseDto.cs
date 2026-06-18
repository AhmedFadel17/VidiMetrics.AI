namespace VidiMetrics.Application.DTOs.Ai.MediaStats;

public record MediaStatsResponseDto
{
    public int TotalVideos { get; init; }
    public int TotalScripts { get; init; }
    public int TotalImages { get; init; }
    public int TotalGenerations { get; init; }
    public int TotalUnlinked { get; init; }
}
