using AutoMapper;
using VidiMetrics.Application.DTOs.Ai.AiImages;
using VidiMetrics.Application.DTOs.Ai.AiScripts;
using VidiMetrics.Application.DTOs.Ai.AiVideos;
using VidiMetrics.Application.DTOs.Ai.ScriptLines;
using VidiMetrics.Domain.Models.Ai;

namespace VidiMetrics.Application.Mapping
{
    public class AiMediaMappingProfile : Profile
    {
        public AiMediaMappingProfile()
        {
            // Images
            CreateMap<UpdateAiImageDto, AiImage>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<AiImage, AiImageResponseDto>();

            // Videos
            CreateMap<UpdateAiVideoDto, AiVideo>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<AiVideo, AiVideoResponseDto>();

            // Scripts & Lines
            CreateMap<CreateAiScriptDto, AiScript>();
            CreateMap<UpdateAiScriptDto, AiScript>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<AiScript, AiScriptResponseDto>();
            CreateMap<ScriptLine, ScriptLineResponseDto>();
            CreateMap<ScriptLineDto, ScriptLine>();
        }
    }
}