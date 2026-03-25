using FluentValidation;
using VidiMetrics.Application.DTOs.StoryEngine.Characters;

namespace VidiMetrics.Application.Validators.StoryEngine.Characters
{
    public class CreateCharacterValidator : AbstractValidator<CreateCharacterDto>
    {
        public CreateCharacterValidator()
        {
            RuleFor(x => x.Name).NotEmpty().WithMessage("Name is required.");
            RuleFor(x => x.PhysicalDescription).NotEmpty().WithMessage("PhysicalDescription is required.");
            RuleFor(x => x.ClothingStyle).NotEmpty().WithMessage("ClothingStyle is required.");
            RuleFor(x => x.PersonalityTraits).NotEmpty().WithMessage("PersonalityTraits is required.");
            RuleFor(x => x.SeriesId).NotEmpty().WithMessage("SeriesId is required.");
        }
    }
}
