using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VidiMetrics.API.Factories;
using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Application.DTOs.Infra.CreditTransactionLedgers;
using VidiMetrics.Application.DTOs.Infra.UserCreditWallets;
using VidiMetrics.Application.DTOs.Infra.UserSubscriptions;
using VidiMetrics.Application.Interfaces.Infra;

namespace VidiMetrics.API.Controllers.Infra
{
    [Route("api/user/subscriptions")]
    [Authorize]
    [ApiController]
    public class UserSubscriptionsController : ApiBaseController
    {
        private readonly IUserSubscriptionsService _subscriptionsService;

        public UserSubscriptionsController(IUserSubscriptionsService subscriptionsService)
        {
            _subscriptionsService = subscriptionsService;
        }

        [HttpGet("balance")]
        public async Task<ActionResult<SuccessResponseDto<UserCreditWalletResponseDto>>> GetBalance()
        {
            var balance = await _subscriptionsService.GetBalanceAsync(CurrentUserGuid);
            return Ok(ApiResponseFactory.Success(balance, "Credit balance retrieved successfully."));
        }

        [HttpGet("history/credits")]
        public async Task<ActionResult<SuccessResponseDto<IEnumerable<CreditTransactionLedgerResponseDto>>>> GetCreditHistory()
        {
            var history = await _subscriptionsService.GetCreditHistoryAsync(CurrentUserGuid);
            return Ok(ApiResponseFactory.Success(history, "Credit transaction ledger history retrieved successfully."));
        }

        [HttpGet("history/subscriptions")]
        public async Task<ActionResult<SuccessResponseDto<IEnumerable<UserSubscriptionResponseDto>>>> GetSubscriptionHistory()
        {
            var history = await _subscriptionsService.GetSubscriptionHistoryAsync(CurrentUserGuid);
            return Ok(ApiResponseFactory.Success(history, "Subscription history retrieved successfully."));
        }

        [HttpPost("cancel")]
        public async Task<ActionResult<SuccessResponseDto<UserSubscriptionResponseDto>>> CancelSubscription()
        {
            var result = await _subscriptionsService.CancelSubscriptionAsync(CurrentUserGuid);
            return Ok(ApiResponseFactory.Success(result, "Subscription cancelled successfully."));
        }

        [HttpPost("upgrade")]
        public async Task<ActionResult<SuccessResponseDto<UserSubscriptionResponseDto>>> UpgradeSubscription([FromBody] UpgradeSubscriptionDto dto)
        {
            var result = await _subscriptionsService.UpgradeSubscriptionAsync(CurrentUserGuid, dto);
            return Ok(ApiResponseFactory.Success(result, "Subscription upgraded successfully."));
        }
    }
}
