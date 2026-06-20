using AutoMapper;
using VidiMetrics.Application.DTOs.Infra.CreditTransactionLedgers;
using VidiMetrics.Application.DTOs.Infra.Notifications;
using VidiMetrics.Application.DTOs.Infra.SubscriptionPlans;
using VidiMetrics.Application.DTOs.Infra.UserCreditWallets;
using VidiMetrics.Application.DTOs.Infra.UserProfiles;
using VidiMetrics.Application.DTOs.Infra.UserSubscriptions;
using VidiMetrics.Domain.Models.Infra;

namespace VidiMetrics.Application.Mapping
{
    public class InfrastructureMappingProfile : Profile
    {
        public InfrastructureMappingProfile()
        {
            // User Profile
            CreateMap<CreateUserProfileDto, UserProfile>();
            CreateMap<UpdateUserProfileDto, UserProfile>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<UserProfile, UserProfileResponseDto>();

            // Subscription & Wallet
            CreateMap<SubscriptionPlan, SubscriptionPlanResponseDto>();
            CreateMap<UserSubscription, UserSubscriptionResponseDto>()
                .ForMember(dest => dest.PlanName, opt => opt.MapFrom(src => src.SubscriptionPlan != null ? src.SubscriptionPlan.Name : string.Empty));
            CreateMap<UserCreditWallet, UserCreditWalletResponseDto>();
            CreateMap<CreditTransactionLedger, CreditTransactionLedgerResponseDto>();

            // Notifications
            CreateMap<Notification, NotificationResponseDto>();
        }
    }
}