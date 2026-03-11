namespace VidiMetrics.Domain.Models.StoryEngine;

public class Scene : BaseEntity
{
    public int Order { get; set; }
    public string Script { get; set; } = string.Empty;
    public string VisualPrompt { get; set; } = string.Empty;

    public Guid EnvironmentId { get; set; }
    public Environment Environment { get; set; } = null!;

    public Guid EpisodeId { get; set; }
    public Episode Episode { get; set; } = null!;

    public ICollection<Character> Characters { get; set; } = new List<Character>();
}