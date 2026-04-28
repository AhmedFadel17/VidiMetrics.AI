using FluentValidation;
using VidiMetrics.Application.DTOs.StoryEngine.Characters;

namespace VidiMetrics.Application.Validators.StoryEngine.Characters
{
    public class UpdateCharacterValidator : AbstractValidator<UpdateCharacterDto>
    {
        public UpdateCharacterValidator()
        {
            RuleFor(x => x.Name).NotEmpty().WithMessage("Name cannot be empty.").When(x => x.Name != null);
            RuleFor(x => x.PhysicalDescription).NotEmpty().WithMessage("PhysicalDescription cannot be empty.").When(x => x.PhysicalDescription != null);
            RuleFor(x => x.ClothingStyle).NotEmpty().WithMessage("ClothingStyle cannot be empty.").When(x => x.ClothingStyle != null);
            RuleFor(x => x.PersonalityTraits).NotEmpty().WithMessage("PersonalityTraits cannot be empty.").When(x => x.PersonalityTraits != null);
            RuleFor(x => x.Role).NotEmpty().WithMessage("Role cannot be empty.").When(x => x.Role != null);
            RuleFor(x => x.InsightLevel).NotEmpty().WithMessage("InsightLevel cannot be empty.").When(x => x.InsightLevel != null);
            RuleFor(x => x.VoiceId).NotEmpty().WithMessage("VoiceId cannot be empty.").When(x => x.VoiceId != null);
            RuleFor(x => x.ReferenceImageUrl).NotEmpty().WithMessage("ReferenceImageUrl cannot be empty.").When(x => x.ReferenceImageUrl != null);
            RuleFor(x => x.ShowId).NotEmpty().WithMessage("ShowId cannot be empty.").When(x => x.ShowId != null);
        }
    }
}
