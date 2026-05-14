using System.ComponentModel.DataAnnotations.Schema;
using VidiMetrics.Domain.Models.Ai;

namespace VidiMetrics.Domain.Models.StoryEngine;

public class Scene : BaseEntity
{
    public int Order { get; set; }

    public Guid EpisodeId { get; set; }
    public Episode Episode { get; set; } = null!;

    public ICollection<SceneCharacter> SceneCharacters { get; set; } = new List<SceneCharacter>();
    public AiScript? AiScript { get; set; }
}
