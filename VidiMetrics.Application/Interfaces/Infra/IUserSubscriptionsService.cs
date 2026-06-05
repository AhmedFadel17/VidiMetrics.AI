using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Infra.CreditTransactionLedgers;
using VidiMetrics.Application.DTOs.Infra.UserCreditWallets;
using VidiMetrics.Application.DTOs.Infra.UserSubscriptions;
using VidiMetrics.Domain.Models.Infra;

namespace VidiMetrics.Application.Interfaces.Infra
{
    public interface IUserSubscriptionsService
    {
        Task<UserCreditWalletResponseDto> GetBalanceAsync(Guid userId);
        Task<UserSubscriptionResponseDto> GetOrCreateActiveSubscriptionAsync(Guid userId);
        Task<UserSubscriptionResponseDto> CreateSubscriptionAsync(Guid userId, Guid? planId = null);
        Task<UserSubscriptionResponseDto> GetUserSubscriptionAsync(Guid userId);
        Task<IEnumerable<CreditTransactionLedgerResponseDto>> GetCreditHistoryAsync(Guid userId);
        Task<IEnumerable<UserSubscriptionResponseDto>> GetSubscriptionHistoryAsync(Guid userId);
        Task<UserSubscriptionResponseDto> CancelSubscriptionAsync(Guid userId);
        Task<UserSubscriptionResponseDto> UpgradeSubscriptionAsync(Guid userId, UpgradeSubscriptionDto dto);
        Task<UserCreditWallet> CreateInitialWalletAsync(Guid userId);
        Task<UserSubscription> CreateInitialFreeSubscriptionAsync(Guid userId);
    }
}
