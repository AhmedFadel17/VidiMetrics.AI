using FluentValidation;
using VidiMetrics.Application.DTOs.StoryEngine.StoryEnvironments;

namespace VidiMetrics.Application.Validators.StoryEngine.StoryEnvironments
{
    public class UpdateStoryEnvironmentValidator : AbstractValidator<UpdateStoryEnvironmentDto>
    {
        public UpdateStoryEnvironmentValidator()
        {
            RuleFor(x => x.Name).NotEmpty().WithMessage("Name cannot be empty.").When(x => x.Name != null);
            RuleFor(x => x.VisualDescription).NotEmpty().WithMessage("VisualDescription cannot be empty.").When(x => x.VisualDescription != null);
            RuleFor(x => x.Atmosphere).NotEmpty().WithMessage("Atmosphere cannot be empty.").When(x => x.Atmosphere != null);
            RuleFor(x => x.ReferenceImageUrl).NotEmpty().WithMessage("ReferenceImageUrl cannot be empty.").When(x => x.ReferenceImageUrl != null);
            RuleFor(x => x.SeriesId).NotEmpty().WithMessage("SeriesId cannot be empty.").When(x => x.SeriesId != null);
        }
    }
}
