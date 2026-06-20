using AutoMapper;
using VidiMetrics.Application.DTOs.Common;


namespace VidiMetrics.Application.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap(typeof(PaginationSource<>), typeof(PaginationResponseDto<>))
                .ConvertUsing(typeof(PaginationConverter<,>));

        }
    }
}
