namespace VidiMetrics.Application.Interfaces.Core;

public interface IAutoPostingOrchestrator
{
    Task HandleEpisodeReadyAsync(Guid episodeId, CancellationToken ct = default);
    Task HandleSceneReadyAsync(Guid sceneId, CancellationToken ct = default);
}
