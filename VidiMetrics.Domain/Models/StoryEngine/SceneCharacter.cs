using System;

namespace VidiMetrics.Domain.Models.StoryEngine
{
    public class SceneCharacter
    {
        public Guid SceneId { get; set; }
        public Scene Scene { get; set; } = null!;

        public Guid CharacterId { get; set; }
        public Character Character { get; set; } = null!;
    }
}
