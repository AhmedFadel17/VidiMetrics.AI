using FluentValidation;
using VidiMetrics.Application.DTOs.StoryEngine.Locations;

namespace VidiMetrics.Application.Validators.StoryEngine.Locations
{
    public class UpdateLocationValidator : AbstractValidator<UpdateLocationDto>
    {
        public UpdateLocationValidator()
        {
            RuleFor(x => x.Name).NotEmpty().WithMessage("Name cannot be empty.").When(x => x.Name != null);
            RuleFor(x => x.VisualDescription).NotEmpty().WithMessage("VisualDescription cannot be empty.").When(x => x.VisualDescription != null);
            RuleFor(x => x.Atmosphere).NotEmpty().WithMessage("Atmosphere cannot be empty.").When(x => x.Atmosphere != null);
            RuleFor(x => x.AiImageId).NotEmpty().WithMessage("AiImageId cannot be empty.").When(x => x.AiImageId != null);
            RuleFor(x => x.ShowId).NotEmpty().WithMessage("ShowId cannot be empty.").When(x => x.ShowId != null);
        }
    }
}
