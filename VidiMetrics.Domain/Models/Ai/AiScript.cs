using VidiMetrics.Domain.Models.StoryEngine;

namespace VidiMetrics.Domain.Models.Ai
{
    public class AiScript : BaseEntity
    {
        public string Weather { get; set; } = string.Empty;
        public string EnvironmentDescription { get; set; } = string.Empty;
        public string VisualPrompt { get; set; } = string.Empty;
        public bool IsLinked { get; set; } = false;

        public Guid StoryEnvironmentId { get; set; }
        public StoryEnvironment StoryEnvironment { get; set; } = null!;
        public Guid UserId { get; set; }
        public ICollection<ScriptLine> ScriptLines { get; set; } = new List<ScriptLine>();
    }
}
