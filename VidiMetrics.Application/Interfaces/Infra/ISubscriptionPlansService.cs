using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Infra.SubscriptionPlans;

namespace VidiMetrics.Application.Interfaces.Infra
{
    public interface ISubscriptionPlansService
    {
        Task<IEnumerable<SubscriptionPlanResponseDto>> GetAllPlansAsync();
        Task<SubscriptionPlanResponseDto> GetPlanByIdAsync(Guid id);
    }
}
