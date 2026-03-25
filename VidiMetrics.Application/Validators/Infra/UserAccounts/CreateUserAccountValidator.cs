using FluentValidation;
using VidiMetrics.Application.DTOs.Infra.UserAccounts;

namespace VidiMetrics.Application.Validators.Infra.UserAccounts
{
    public class CreateUserAccountValidator : AbstractValidator<CreateUserAccountDto>
    {
        public CreateUserAccountValidator()
        {
            RuleFor(x => x.Id).NotEmpty().WithMessage("Id is required.");
            RuleFor(x => x.ExternalId).NotEmpty().WithMessage("ExternalId is required.");
            RuleFor(x => x.Email).NotEmpty().WithMessage("Email is required.");
            RuleFor(x => x.FullName).NotEmpty().WithMessage("FullName is required.");
            RuleFor(x => x.SubscriptionTier).NotEmpty().WithMessage("SubscriptionTier is required.");
            RuleFor(x => x.LastLoginAt).NotEmpty().WithMessage("LastLoginAt is required.");
        }
    }
}
