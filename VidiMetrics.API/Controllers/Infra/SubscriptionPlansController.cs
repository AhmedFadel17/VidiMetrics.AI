using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using VidiMetrics.API.Factories;
using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Application.DTOs.Infra.SubscriptionPlans;
using VidiMetrics.Application.Interfaces.Infra;

namespace VidiMetrics.API.Controllers.Infra
{
    [Route("api/subscriptions/plans")]
    [ApiController]
    public class SubscriptionPlansController : ControllerBase
    {
        private readonly ISubscriptionPlansService _plansService;

        public SubscriptionPlansController(ISubscriptionPlansService plansService)
        {
            _plansService = plansService;
        }

        [HttpGet]
        public async Task<ActionResult<SuccessResponseDto<IEnumerable<SubscriptionPlanResponseDto>>>> GetAllPlans()
        {
            var plans = await _plansService.GetAllPlansAsync();
            return Ok(ApiResponseFactory.Success(plans, "Subscription plans retrieved successfully."));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SuccessResponseDto<SubscriptionPlanResponseDto>>> GetPlanById(Guid id)
        {
            var plan = await _plansService.GetPlanByIdAsync(id);
            return Ok(ApiResponseFactory.Success(plan, "Subscription plan details retrieved successfully."));
        }
    }
}
