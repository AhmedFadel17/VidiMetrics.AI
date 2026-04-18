using FluentValidation;
using VidiMetrics.Application.DTOs.Infra.UserProfiles;

namespace VidiMetrics.Application.Validators.Infra.UserProfiles
{
    public class UpdateUserProfileValidator : AbstractValidator<UpdateUserProfileDto>
    {
        public UpdateUserProfileValidator()
        {
            RuleFor(x => x.Email).NotEmpty().EmailAddress().WithMessage("A valid Email cannot be empty.").When(x => x.Email != null);
            RuleFor(x => x.FullName).NotEmpty().WithMessage("FullName cannot be empty.").When(x => x.FullName != null);
        }
    }
}
