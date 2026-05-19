using System;
using System.Collections.Generic;
using VidiMetrics.Domain.Models.Ai;

namespace VidiMetrics.Domain.Models.StoryEngine
{
    public class Scene : BaseEntity
    {
        public int Order { get; set; }
        public string Name { get; set; } = string.Empty;

        public Guid EpisodeId { get; set; }
        public Episode Episode { get; set; } = null!;

        public ICollection<SceneCharacter> SceneCharacters { get; set; } = new List<SceneCharacter>();

        public Guid? AiScriptId { get; set; }
        public AiScript? AiScript { get; set; }

        public Guid? AiVideoId { get; set; }
        public AiVideo? AiVideo { get; set; }
    }
}
