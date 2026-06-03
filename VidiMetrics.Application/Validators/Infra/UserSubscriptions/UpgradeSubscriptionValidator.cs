using FluentValidation;
using VidiMetrics.Application.DTOs.Infra.UserSubscriptions;

namespace VidiMetrics.Application.Validators.Infra.UserSubscriptions
{
    public class UpgradeSubscriptionValidator : AbstractValidator<UpgradeSubscriptionDto>
    {
        public UpgradeSubscriptionValidator()
        {
            RuleFor(x => x.PlanId)
                .NotEmpty().WithMessage("Plan ID is required.");
        }
    }
}
