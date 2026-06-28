using System;

namespace VidiMetrics.API.Events
{
    public record CompileEpisodeCommand(Guid EpisodeId, Guid UserId);
}
