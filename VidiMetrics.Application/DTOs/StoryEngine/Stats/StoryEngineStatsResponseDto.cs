namespace VidiMetrics.Application.DTOs.StoryEngine.Stats;

public record StoryEngineStatsResponseDto
{
    public int TotalShows { get; init; }
    public int TotalEpisodes { get; init; }
    public int TotalScenes { get; init; }
    public int TotalCharacters { get; init; }
    public int TotalLocations { get; init; }
}
