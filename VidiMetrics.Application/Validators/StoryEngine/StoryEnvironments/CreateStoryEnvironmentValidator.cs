using FluentValidation;
using VidiMetrics.Application.DTOs.StoryEngine.StoryEnvironments;

namespace VidiMetrics.Application.Validators.StoryEngine.StoryEnvironments
{
    public class CreateStoryEnvironmentValidator : AbstractValidator<CreateStoryEnvironmentDto>
    {
        public CreateStoryEnvironmentValidator()
        {
            RuleFor(x => x.Name).NotEmpty().WithMessage("Name is required.");
            RuleFor(x => x.VisualDescription).NotEmpty().WithMessage("VisualDescription is required.");
            RuleFor(x => x.Atmosphere).NotEmpty().WithMessage("Atmosphere is required.");
            RuleFor(x => x.SeriesId).NotEmpty().WithMessage("SeriesId is required.");
        }
    }
}
