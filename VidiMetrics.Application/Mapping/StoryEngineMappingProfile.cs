using System.Linq;
using AutoMapper;
using VidiMetrics.Application.DTOs.StoryEngine.Characters;
using VidiMetrics.Application.DTOs.StoryEngine.Episodes;
using VidiMetrics.Application.DTOs.StoryEngine.Locations;
using VidiMetrics.Application.DTOs.StoryEngine.Scenes;
using VidiMetrics.Application.DTOs.StoryEngine.Shows;
using VidiMetrics.Domain.Models.StoryEngine;

namespace VidiMetrics.Application.Mapping
{
    public class StoryEngineMappingProfile : Profile
    {
        public StoryEngineMappingProfile()
        {
            // Shows
            CreateMap<CreateShowDto, Show>();
            CreateMap<UpdateShowDto, Show>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<Show, ShowResponseDto>();

            // Episodes
            CreateMap<CreateEpisodeDto, Episode>();
            CreateMap<UpdateEpisodeDto, Episode>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<Episode, EpisodeResponseDto>();

            // Locations
            CreateMap<CreateLocationDto, Location>();
            CreateMap<UpdateLocationDto, Location>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<Location, LocationResponseDto>();

            // Characters
            CreateMap<CreateCharacterDto, Character>();
            CreateMap<UpdateCharacterDto, Character>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<Character, CharacterResponseDto>();

            // Scenes
            CreateMap<CreateSceneDto, Scene>()
                .ForMember(dest => dest.SceneCharacters, opt => opt.Ignore());
            CreateMap<UpdateSceneDto, Scene>()
                .ForMember(dest => dest.SceneCharacters, opt => opt.Ignore())
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<Scene, SceneResponseDto>()
                .ForMember(dest => dest.Characters, opt => opt.MapFrom(src => src.SceneCharacters.Select(sc => sc.Character)));
        }
    }
}