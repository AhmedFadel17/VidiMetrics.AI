using AutoMapper;
using VidiMetrics.Application.DTOs.Core.Videos;
using VidiMetrics.Domain.Models.Core;

namespace VidiMetrics.Application.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<CreateVideoDto, Video>();
        }
    }
}
