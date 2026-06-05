using FluentValidation;
using VidiMetrics.Application.DTOs.Infra.UserProfiles;

namespace VidiMetrics.Application.Validators.Infra.UserProfiles
{
    public class UpdateUserProfileValidator : AbstractValidator<UpdateUserProfileDto>
    {
        public UpdateUserProfileValidator()
        {
            RuleFor(x => x.Bio)
                .MaximumLength(455).WithMessage("A valid Bio cannot be longer than 455 characters.")
                .When(x => x.Bio != null);

            RuleFor(x => x.FullName)
                .NotEmpty().WithMessage("FullName cannot be empty.")
                .MaximumLength(155).WithMessage("A valid FullName cannot be longer than 155 characters.")
                .When(x => x.FullName != null);
        }
    }
}
