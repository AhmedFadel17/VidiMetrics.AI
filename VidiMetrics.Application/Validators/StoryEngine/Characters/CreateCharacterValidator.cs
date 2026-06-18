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
            RuleFor(x => x.Role).NotEmpty().WithMessage("Role is required.");
            RuleFor(x => x.InsightLevel).NotEmpty().WithMessage("InsightLevel is required.");
            // RuleFor(x => x.VoiceProfileId).NotEmpty().WithMessage("VoiceId is required.");
            // RuleFor(x => x.AiImageId).NotEmpty().WithMessage("ImageId is required.");
            RuleFor(x => x.ShowId).NotEmpty().WithMessage("ShowId is required.");
        }
    }
}
