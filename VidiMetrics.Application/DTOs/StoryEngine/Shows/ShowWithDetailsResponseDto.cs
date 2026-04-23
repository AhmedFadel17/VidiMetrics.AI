using System;
using VidiMetrics.Application.DTOs.StoryEngine.Characters;
using VidiMetrics.Application.DTOs.StoryEngine.Episodes;
using VidiMetrics.Application.DTOs.StoryEngine.StoryEnvironments;

namespace VidiMetrics.Application.DTOs.StoryEngine.Shows
{
    public class ShowWithDetailsResponseDto : ShowResponseDto
    {
        public List<EpisodeResponseDto>? Episodes { get; set; }
        public List<CharacterResponseDto>? Characters { get; set; }
        public List<StoryEnvironmentResponseDto>? StoryEnvironments { get; set; }
        public int TotalEpisodes { get; set; }
    }
}
