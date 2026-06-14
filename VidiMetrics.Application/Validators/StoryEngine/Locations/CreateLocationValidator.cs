using FluentValidation;
using VidiMetrics.Application.DTOs.StoryEngine.Locations;

namespace VidiMetrics.Application.Validators.StoryEngine.Locations
{
    public class CreateLocationValidator : AbstractValidator<CreateLocationDto>
    {
        public CreateLocationValidator()
        {
            RuleFor(x => x.Name).NotEmpty().WithMessage("Name is required.");
            RuleFor(x => x.VisualDescription).NotEmpty().WithMessage("VisualDescription is required.");
            RuleFor(x => x.Atmosphere).NotEmpty().WithMessage("Atmosphere is required.");
            RuleFor(x => x.AiImageId).NotEmpty().WithMessage("AiImageId is required.");
            RuleFor(x => x.ShowId).NotEmpty().WithMessage("ShowId is required.");
        }
    }
}
