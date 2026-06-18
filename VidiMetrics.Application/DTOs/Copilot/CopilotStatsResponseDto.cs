namespace VidiMetrics.Application.DTOs.Copilot;

public record CopilotStatsResponseDto
{
    public int TotalChats { get; init; }
    public int TotalDrafts { get; init; }
    public int TotalMessages { get; init; }
    public int ExecutedDrafts { get; init; }
    public int PendingDrafts { get; init; }
    public int RejectedDrafts { get; init; }
    public int FailedDrafts { get; init; }
}
