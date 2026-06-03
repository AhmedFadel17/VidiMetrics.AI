using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using VidiMetrics.Application.DTOs.Infra.CreditTransactionLedgers;
using VidiMetrics.Application.DTOs.Infra.UserCreditWallets;
using VidiMetrics.Application.DTOs.Infra.UserSubscriptions;
using VidiMetrics.Application.Interfaces.Infra;
using VidiMetrics.DataAccess.Repositories.Infra.CreditTransactionLedgers;
using VidiMetrics.DataAccess.Repositories.Infra.SubscriptionPlans;
using VidiMetrics.DataAccess.Repositories.Infra.UserCreditWallets;
using VidiMetrics.DataAccess.Repositories.Infra.UserProfiles;
using VidiMetrics.DataAccess.Repositories.Infra.UserSubscriptions;
using VidiMetrics.Domain.Enums;
using VidiMetrics.Domain.Models.Infra;

namespace VidiMetrics.Application.Services.Infra
{
    public class UserSubscriptionsService : IUserSubscriptionsService
    {
        private readonly IUserSubscriptionsRepository _subscriptionsRepository;
        private readonly ISubscriptionPlansRepository _plansRepository;
        private readonly IUserCreditWalletsRepository _walletsRepository;
        private readonly ICreditTransactionLedgersRepository _ledgersRepository;
        private readonly IUserProfilesRepository _userProfilesRepository;
        private readonly IMapper _mapper;
        private readonly IValidator<UpgradeSubscriptionDto> _validator;

        public UserSubscriptionsService(
            IUserSubscriptionsRepository subscriptionsRepository,
            ISubscriptionPlansRepository plansRepository,
            IUserCreditWalletsRepository walletsRepository,
            ICreditTransactionLedgersRepository ledgersRepository,
            IUserProfilesRepository userProfilesRepository,
            IMapper mapper,
            IValidator<UpgradeSubscriptionDto> validator)
        {
            _subscriptionsRepository = subscriptionsRepository;
            _plansRepository = plansRepository;
            _walletsRepository = walletsRepository;
            _ledgersRepository = ledgersRepository;
            _userProfilesRepository = userProfilesRepository;
            _mapper = mapper;
            _validator = validator;
        }

        public async Task<UserCreditWalletResponseDto> GetBalanceAsync(Guid userId)
        {
            var wallet = await _walletsRepository.Query()
                .FirstOrDefaultAsync(w => w.UserId == userId);

            if (wallet == null)
            {
                var profile = await _userProfilesRepository.Query()
                    .Include(p => p.SubscriptionPlan)
                    .FirstOrDefaultAsync(p => p.UserId == userId);

                if (profile == null) throw new Exception("User profile not found.");

                wallet = new UserCreditWallet
                {
                    UserId = userId,
                    // UserProfile = profile,
                    TotalCreditsAvailable = profile.SubscriptionPlan.BaseMonthlyCredits,
                    CreditsUsed = 0,
                    LastResetDate = DateTime.UtcNow,
                    NextResetDate = DateTime.UtcNow.AddMonths(1)
                };

                await _walletsRepository.AddAsync(wallet);
                await _walletsRepository.SaveChangesAsync();
            }

            return _mapper.Map<UserCreditWalletResponseDto>(wallet);
        }

        public async Task<IEnumerable<CreditTransactionLedgerResponseDto>> GetCreditHistoryAsync(Guid userId)
        {
            var history = await _ledgersRepository.Query()
                .Where(l => l.UserId == userId)
                .OrderByDescending(l => l.Timestamp)
                .ToListAsync();

            return _mapper.Map<IEnumerable<CreditTransactionLedgerResponseDto>>(history);
        }

        public async Task<IEnumerable<UserSubscriptionResponseDto>> GetSubscriptionHistoryAsync(Guid userId)
        {
            var history = await _subscriptionsRepository.Query()
                .Include(s => s.SubscriptionPlan)
                .Where(s => s.UserId == userId)
                .OrderByDescending(s => s.StartDate)
                .ToListAsync();

            return _mapper.Map<IEnumerable<UserSubscriptionResponseDto>>(history);
        }

        public async Task<UserSubscriptionResponseDto> CancelSubscriptionAsync(Guid userId)
        {
            var activeSubscription = await _subscriptionsRepository.Query()
                .Include(s => s.SubscriptionPlan)
                .FirstOrDefaultAsync(s => s.UserId == userId && s.Status == SubscriptionStatus.Active);

            if (activeSubscription == null)
            {
                throw new Exception("No active subscription found to cancel.");
            }

            activeSubscription.Status = SubscriptionStatus.Cancelled;
            activeSubscription.CancelledAt = DateTime.UtcNow;

            _subscriptionsRepository.Update(activeSubscription);
            await _subscriptionsRepository.SaveChangesAsync();

            return _mapper.Map<UserSubscriptionResponseDto>(activeSubscription);
        }

        public async Task<UserSubscriptionResponseDto> UpgradeSubscriptionAsync(Guid userId, UpgradeSubscriptionDto dto)
        {
            await _validator.ValidateAndThrowAsync(dto);

            var newPlan = await _plansRepository.GetByIdAsync(dto.PlanId);
            if (newPlan == null || !newPlan.IsActive)
            {
                throw new Exception("The selected subscription plan does not exist or is inactive.");
            }

            var profile = await _userProfilesRepository.GetByIdAsync(userId);
            if (profile == null)
            {
                throw new Exception("User profile not found.");
            }

            // Cancel any current active subscriptions
            var activeSubscriptions = await _subscriptionsRepository.Query()
                .Where(s => s.UserId == userId && s.Status == SubscriptionStatus.Active)
                .ToListAsync();

            foreach (var sub in activeSubscriptions)
            {
                sub.Status = SubscriptionStatus.Expired;
                sub.CancelledAt = DateTime.UtcNow;
                _subscriptionsRepository.Update(sub);
            }

            // Create new active subscription
            var newSubscription = new UserSubscription
            {
                UserId = userId,
                PlanId = newPlan.Id,
                StartDate = DateTime.UtcNow,
                CurrentPeriodStart = DateTime.UtcNow,
                CurrentPeriodEnd = DateTime.UtcNow.AddMonths(1),
                Status = SubscriptionStatus.Active
            };

            await _subscriptionsRepository.AddAsync(newSubscription);

            // Update user profile plan
            profile.SubscriptionPlanId = newPlan.Id;
            _userProfilesRepository.Update(profile);

            // Reset credit wallet
            var wallet = await _walletsRepository.Query()
                .FirstOrDefaultAsync(w => w.UserId == userId);

            if (wallet == null)
            {
                wallet = new UserCreditWallet
                {
                    UserId = userId,
                    TotalCreditsAvailable = newPlan.BaseMonthlyCredits,
                    CreditsUsed = 0,
                    LastResetDate = DateTime.UtcNow,
                    NextResetDate = DateTime.UtcNow.AddMonths(1)
                };
                await _walletsRepository.AddAsync(wallet);
            }
            else
            {
                wallet.TotalCreditsAvailable = newPlan.BaseMonthlyCredits;
                wallet.CreditsUsed = 0;
                wallet.LastResetDate = DateTime.UtcNow;
                wallet.NextResetDate = DateTime.UtcNow.AddMonths(1);
                _walletsRepository.Update(wallet);
            }

            // Record transaction ledger (for tracking)
            var ledger = new CreditTransactionLedger
            {
                UserId = userId,
                ActionType = CreditActionType.GenerateImage, // fallback/placeholder or custom type if needed
                AmountDeducted = 0,
                Description = $"Upgraded to plan: {newPlan.Name}. Credits reset to {newPlan.BaseMonthlyCredits}.",
                Timestamp = DateTime.UtcNow
            };
            await _ledgersRepository.AddAsync(ledger);

            await _subscriptionsRepository.SaveChangesAsync();

            // Load subscription plan details for mapper
            newSubscription.SubscriptionPlan = newPlan;

            return _mapper.Map<UserSubscriptionResponseDto>(newSubscription);
        }
    }
}
