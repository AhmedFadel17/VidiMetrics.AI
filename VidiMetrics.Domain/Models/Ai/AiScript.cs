using VidiMetrics.Domain.Models.StoryEngine;

namespace VidiMetrics.Domain.Models.Ai;

public class AiScript : BaseEntity
{
    public string Weather { get; set; } = string.Empty;
    public string EnvironmentDescription { get; set; } = string.Empty;
    public string VisualPrompt { get; set; } = string.Empty;

    public Guid StoryEnvironmentId { get; set; }
    public StoryEnvironment StoryEnvironment { get; set; } = null!;
    public Guid SceneId { get; set; }
    public Scene Scene { get; set; } = null!;

    public ICollection<ScriptLine> ScriptLines { get; set; } = new List<ScriptLine>();
}
