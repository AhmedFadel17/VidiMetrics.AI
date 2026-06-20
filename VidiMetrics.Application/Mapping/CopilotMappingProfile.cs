using System.Collections.Generic;
using AutoMapper;
using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Application.DTOs.Copilot;
using VidiMetrics.Domain.Models.Copilot;

namespace VidiMetrics.Application.Mapping
{
    public class CopilotMappingProfile : Profile
    {
        public CopilotMappingProfile()
        {

            // Copilot Feature

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