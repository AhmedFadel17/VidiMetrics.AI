using AutoMapper;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Infra.SubscriptionPlans;
using VidiMetrics.Application.Interfaces.Infra;
using VidiMetrics.DataAccess.Repositories.Infra.SubscriptionPlans;

namespace VidiMetrics.Application.Services.Infra
{
    public class SubscriptionPlansService : ISubscriptionPlansService
    {
        private readonly ISubscriptionPlansRepository _repository;
        private readonly IMapper _mapper;

        public SubscriptionPlansService(ISubscriptionPlansRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<SubscriptionPlanResponseDto>> GetAllPlansAsync()
        {
            var entities = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<SubscriptionPlanResponseDto>>(entities);
        }

        public async Task<SubscriptionPlanResponseDto> GetPlanByIdAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("Subscription plan not found.");
            return _mapper.Map<SubscriptionPlanResponseDto>(entity);
        }
    }
}
