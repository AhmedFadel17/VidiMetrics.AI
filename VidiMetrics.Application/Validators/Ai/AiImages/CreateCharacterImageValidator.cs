using FluentValidation;
using VidiMetrics.Application.DTOs.Ai.AiImages;

namespace VidiMetrics.Application.Validators.Ai.AiImages;

public class CreateCharacterImageValidator : AbstractValidator<CreateCharacterImageDto>
{
    public CreateCharacterImageValidator()
    {
        RuleFor(x => x.Name).NotEmpty().WithMessage("Name is required.").MaximumLength(200).WithMessage("Name cannot be longer than 200 characters.");
        RuleFor(x => x.ClothingStyle).NotEmpty().WithMessage("Clothing style is required.").MaximumLength(2000);
        RuleFor(x => x.PersonalityTraits).NotEmpty().WithMessage("Personality traits is required.").MaximumLength(2000);
        RuleFor(x => x.Role).NotEmpty().WithMessage("Role is required.").MaximumLength(200);
    }
}
