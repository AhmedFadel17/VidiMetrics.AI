using FluentValidation;
using VidiMetrics.Application.DTOs.Ai.AiImages;

namespace VidiMetrics.Application.Validators.Ai.AiImages;

public class CreateEnvironmentImageValidator : AbstractValidator<CreateEnvironmentImageDto>
{
    public CreateEnvironmentImageValidator()
    {
        RuleFor(x => x.Name).NotEmpty().WithMessage("Name is required.").MaximumLength(200).WithMessage("Name cannot be longer than 200 characters.");
        RuleFor(x => x.VisualDescription).NotEmpty().WithMessage("Visual description is required.").MaximumLength(2000).WithMessage("Visual description cannot be longer than 2000 characters.");
        RuleFor(x => x.Atmosphere).NotEmpty().WithMessage("Atmosphere is required.").MaximumLength(2000).WithMessage("Atmosphere cannot be longer than 2000 characters.");
    }
}
