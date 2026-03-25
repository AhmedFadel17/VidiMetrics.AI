using FluentValidation;
using VidiMetrics.Application.DTOs.Infra.UserAccounts;

namespace VidiMetrics.Application.Validators.Infra.UserAccounts
{
    public class UpdateUserAccountValidator : AbstractValidator<UpdateUserAccountDto>
    {
        public UpdateUserAccountValidator()
        {
            RuleFor(x => x.ExternalId).NotEmpty().WithMessage("ExternalId cannot be empty.").When(x => x.ExternalId != null);
            RuleFor(x => x.Email).NotEmpty().WithMessage("Email cannot be empty.").When(x => x.Email != null);
            RuleFor(x => x.FullName).NotEmpty().WithMessage("FullName cannot be empty.").When(x => x.FullName != null);
            RuleFor(x => x.SubscriptionTier).NotEmpty().WithMessage("SubscriptionTier cannot be empty.").When(x => x.SubscriptionTier != null);
            RuleFor(x => x.LastLoginAt).NotEmpty().WithMessage("LastLoginAt cannot be empty.").When(x => x.LastLoginAt != null);
        }
    }
}
