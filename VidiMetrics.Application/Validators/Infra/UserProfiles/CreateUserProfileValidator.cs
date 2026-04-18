using FluentValidation;
using VidiMetrics.Application.DTOs.Infra.UserProfiles;

namespace VidiMetrics.Application.Validators.Infra.UserProfiles
{
    public class CreateUserProfileValidator : AbstractValidator<CreateUserProfileDto>
    {
        public CreateUserProfileValidator()
        {
            RuleFor(x => x.UserId).NotEmpty().WithMessage("UserId is required.");
            RuleFor(x => x.Email).NotEmpty().EmailAddress().WithMessage("A valid Email is required.");
            RuleFor(x => x.FullName).NotEmpty().WithMessage("FullName is required.");
        }
    }
}
