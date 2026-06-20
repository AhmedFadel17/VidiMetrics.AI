using AutoMapper;
using VidiMetrics.Application.DTOs.Core.ChannelPosts;
using VidiMetrics.Application.DTOs.Core.Channels;
using VidiMetrics.Application.DTOs.Core.ChannelStats;
using VidiMetrics.Application.DTOs.Core.ShowChannels;
using VidiMetrics.Domain.Models.Core;

namespace VidiMetrics.Application.Mapping;

public class CoreMappingProfile : Profile
{
    public CoreMappingProfile()
    {
        // Channels
        CreateMap<CreateChannelDto, Channel>();
        CreateMap<UpdateChannelDto, Channel>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        CreateMap<Channel, ChannelResponseDto>();

        // Channel Posts
        CreateMap<CreateChannelPostDto, ChannelPost>();
        CreateMap<UpdateChannelPostDto, ChannelPost>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        CreateMap<ChannelPost, ChannelPostResponseDto>();

        // Channel Stats
        CreateMap<ChannelStat, ChannelStatResponseDto>();

        // Show Channels
        CreateMap<UpdateShowChannelSettingsDto, ShowChannel>();
        CreateMap<ShowChannel, ShowChannelResponseDto>();

    }


}
