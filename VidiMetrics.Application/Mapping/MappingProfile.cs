using System.Linq;
using AutoMapper;
using VidiMetrics.Application.DTOs.Ai.AiImages;
using VidiMetrics.Application.DTOs.Ai.AiPromptTemplates;
using VidiMetrics.Application.DTOs.Ai.AiTasks;
using VidiMetrics.Application.DTOs.Ai.AiVideos;
using VidiMetrics.Application.DTOs.Ai.Transcripts;
using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Application.DTOs.Copilot;
using VidiMetrics.Application.DTOs.Core.ChannelPosts;
using VidiMetrics.Application.DTOs.Core.Channels;
using VidiMetrics.Application.DTOs.Core.ChannelStats;
using VidiMetrics.Application.DTOs.Infra.CreditTransactionLedgers;
using VidiMetrics.Application.DTOs.Infra.Notifications;
using VidiMetrics.Application.DTOs.Infra.SubscriptionPlans;
using VidiMetrics.Application.DTOs.Infra.UserCreditWallets;
using VidiMetrics.Application.DTOs.Infra.UserProfiles;
using VidiMetrics.Application.DTOs.Infra.UserSubscriptions;
using VidiMetrics.Application.DTOs.Seo.CompetitorVideos;
using VidiMetrics.Application.DTOs.Seo.KeywordRankings;
using VidiMetrics.Application.DTOs.Seo.Keywords;
using VidiMetrics.Application.DTOs.Seo.SeoAudits;
using VidiMetrics.Application.DTOs.Seo.VideoTags;
using VidiMetrics.Application.DTOs.StoryEngine.Characters;
using VidiMetrics.Application.DTOs.StoryEngine.Episodes;
using VidiMetrics.Application.DTOs.StoryEngine.Locations;
using VidiMetrics.Application.DTOs.StoryEngine.Scenes;
using VidiMetrics.Application.DTOs.StoryEngine.Shows;
using VidiMetrics.Domain.Models.Ai;
using VidiMetrics.Domain.Models.Copilot;
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

            CreateMap<ChannelStat, ChannelStatResponseDto>();

            CreateMap<CreateUserProfileDto, UserProfile>();
            CreateMap<UpdateUserProfileDto, UserProfile>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<UserProfile, UserProfileResponseDto>();

            CreateMap<SubscriptionPlan, SubscriptionPlanResponseDto>();
            CreateMap<UserSubscription, UserSubscriptionResponseDto>()
                .ForMember(dest => dest.PlanName, opt => opt.MapFrom(src => src.SubscriptionPlan != null ? src.SubscriptionPlan.Name : string.Empty));
            CreateMap<UserCreditWallet, UserCreditWalletResponseDto>();
            CreateMap<CreditTransactionLedger, CreditTransactionLedgerResponseDto>();

            CreateMap<Notification, NotificationResponseDto>();

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

            CreateMap<CreateLocationDto, Location>();
            CreateMap<UpdateLocationDto, Location>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<Location, LocationResponseDto>();

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

            CreateMap<CreateCopilotChatDto, CopilotChat>();
            CreateMap<CopilotChat, CopilotChatResponseDto>();
            CreateMap<CopilotMessage, CopilotMessageResponseDto>();
            CreateMap<CopilotDraft, CopilotDraftResponseDto>();
            CreateMap<CopilotDraft, CopilotDraftPreviewDto>()
                .ForMember(dest => dest.DraftId, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.Payload, opt => opt.MapFrom(src => string.IsNullOrWhiteSpace(src.PayloadJson) ? null : System.Text.Json.JsonSerializer.Deserialize<object>(src.PayloadJson, (System.Text.Json.JsonSerializerOptions?)null)))
                .ForMember(dest => dest.MissingFields, opt => opt.MapFrom(src => string.IsNullOrWhiteSpace(src.MissingFieldsJson) ? new List<string>() : System.Text.Json.JsonSerializer.Deserialize<List<string>>(src.MissingFieldsJson, (System.Text.Json.JsonSerializerOptions?)null)))
                .ForMember(dest => dest.ValidationWarnings, opt => opt.MapFrom(src => string.IsNullOrWhiteSpace(src.ValidationWarningsJson) ? new List<string>() : System.Text.Json.JsonSerializer.Deserialize<List<string>>(src.ValidationWarningsJson, (System.Text.Json.JsonSerializerOptions?)null)))
                .ForMember(dest => dest.CanExecute, opt => opt.MapFrom(src =>
                    (string.IsNullOrWhiteSpace(src.MissingFieldsJson) || src.MissingFieldsJson == "[]") &&
                    (string.IsNullOrWhiteSpace(src.ValidationWarningsJson) || src.ValidationWarningsJson == "[]")
                ))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status))
                .ForMember(dest => dest.ExecutionResultJson, opt => opt.MapFrom(src => src.ExecutionResultJson))
                .ForMember(dest => dest.ErrorMessage, opt => opt.MapFrom(src => src.ErrorMessage));
        }
    }
}
