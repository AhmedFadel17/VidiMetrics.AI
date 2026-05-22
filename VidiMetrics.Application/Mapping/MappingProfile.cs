using System.Linq;
using AutoMapper;
using VidiMetrics.Application.DTOs.Ai.AiImages;
using VidiMetrics.Application.DTOs.Ai.AiPromptTemplates;
using VidiMetrics.Application.DTOs.Ai.AiTasks;
using VidiMetrics.Application.DTOs.Ai.AiVideos;
using VidiMetrics.Application.DTOs.Ai.Transcripts;
using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Application.DTOs.Core.ChannelPosts;
using VidiMetrics.Application.DTOs.Core.Channels;
using VidiMetrics.Application.DTOs.Infra.ApiUsageQuotas;
using VidiMetrics.Application.DTOs.Infra.UserProfiles;
using VidiMetrics.Application.DTOs.Seo.CompetitorVideos;
using VidiMetrics.Application.DTOs.Seo.KeywordRankings;
using VidiMetrics.Application.DTOs.Seo.Keywords;
using VidiMetrics.Application.DTOs.Seo.SeoAudits;
using VidiMetrics.Application.DTOs.Seo.VideoTags;
using VidiMetrics.Application.DTOs.StoryEngine.Characters;
using VidiMetrics.Application.DTOs.StoryEngine.Episodes;
using VidiMetrics.Application.DTOs.StoryEngine.Scenes;
using VidiMetrics.Application.DTOs.StoryEngine.Shows;
using VidiMetrics.Application.DTOs.StoryEngine.StoryEnvironments;
using VidiMetrics.Domain.Models.Ai;
using VidiMetrics.Domain.Models.Core;
using VidiMetrics.Domain.Models.Infra;
using VidiMetrics.Domain.Models.Seo;
using VidiMetrics.Domain.Models.StoryEngine;

namespace VidiMetrics.Application.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap(typeof(PaginationSource<>), typeof(PaginationResponseDto<>))
                .ConvertUsing(typeof(PaginationConverter<,>));

            CreateMap<CreateAiTaskDto, AiTask>();
            CreateMap<UpdateAiTaskDto, AiTask>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<AiTask, AiTaskResponseDto>();

            CreateMap<UpdateAiImageDto, AiImage>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<AiImage, AiImageResponseDto>();

            CreateMap<UpdateAiVideoDto, AiVideo>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<AiVideo, AiVideoResponseDto>();

            CreateMap<CreateTranscriptDto, Transcript>();
            CreateMap<UpdateTranscriptDto, Transcript>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<Transcript, TranscriptResponseDto>();

            CreateMap<CreateChannelDto, Channel>();
            CreateMap<UpdateChannelDto, Channel>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<Channel, ChannelResponseDto>();

            CreateMap<CreateChannelPostDto, ChannelPost>();
            CreateMap<UpdateChannelPostDto, ChannelPost>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<ChannelPost, ChannelPostResponseDto>();

            CreateMap<CreateApiUsageQuotaDto, ApiUsageQuota>();
            CreateMap<UpdateApiUsageQuotaDto, ApiUsageQuota>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<ApiUsageQuota, ApiUsageQuotaResponseDto>();

            CreateMap<CreateUserProfileDto, UserProfile>();
            CreateMap<UpdateUserProfileDto, UserProfile>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<UserProfile, UserProfileResponseDto>();

            CreateMap<CreateCompetitorVideoDto, CompetitorVideo>();
            CreateMap<UpdateCompetitorVideoDto, CompetitorVideo>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<CompetitorVideo, CompetitorVideoResponseDto>();

            CreateMap<CreateKeywordRankingDto, KeywordRanking>();
            CreateMap<UpdateKeywordRankingDto, KeywordRanking>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<KeywordRanking, KeywordRankingResponseDto>();

            CreateMap<CreateKeywordDto, Keyword>();
            CreateMap<UpdateKeywordDto, Keyword>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<Keyword, KeywordResponseDto>();

            CreateMap<CreateSeoAuditDto, SeoAudit>();
            CreateMap<UpdateSeoAuditDto, SeoAudit>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<SeoAudit, SeoAuditResponseDto>();

            CreateMap<CreateVideoTagDto, VideoTag>();
            CreateMap<UpdateVideoTagDto, VideoTag>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<VideoTag, VideoTagResponseDto>();

            CreateMap<CreateCharacterDto, Character>();
            CreateMap<UpdateCharacterDto, Character>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<Character, CharacterResponseDto>();

            CreateMap<CreateEpisodeDto, Episode>();
            CreateMap<UpdateEpisodeDto, Episode>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<Episode, EpisodeResponseDto>();

            CreateMap<CreateShowDto, Show>();
            CreateMap<UpdateShowDto, Show>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<Show, ShowResponseDto>();

            CreateMap<CreateStoryEnvironmentDto, StoryEnvironment>();
            CreateMap<UpdateStoryEnvironmentDto, StoryEnvironment>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<StoryEnvironment, StoryEnvironmentResponseDto>();

            CreateMap<CreateSceneDto, Scene>()
                .ForMember(dest => dest.SceneCharacters, opt => opt.Ignore());
            CreateMap<UpdateSceneDto, Scene>()
                .ForMember(dest => dest.SceneCharacters, opt => opt.Ignore())
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<Scene, SceneResponseDto>()
                .ForMember(dest => dest.Characters, opt => opt.MapFrom(src => src.SceneCharacters.Select(sc => sc.Character)));

            CreateMap<VidiMetrics.Application.DTOs.Ai.AiScripts.CreateAiScriptDto, AiScript>();
            CreateMap<VidiMetrics.Application.DTOs.Ai.AiScripts.UpdateAiScriptDto, AiScript>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<AiScript, VidiMetrics.Application.DTOs.Ai.AiScripts.AiScriptResponseDto>();
            CreateMap<ScriptLine, VidiMetrics.Application.DTOs.Ai.AiScripts.ScriptLineResponseDto>();
            CreateMap<VidiMetrics.Application.DTOs.Ai.ScriptLines.ScriptLineDto, ScriptLine>();
        }
    }
}
