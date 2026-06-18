using FluentValidation;
using VidiMetrics.Application.DTOs.StoryEngine.Shows;

namespace VidiMetrics.Application.Validators.StoryEngine.Shows
{
    public class CreateShowValidator : AbstractValidator<CreateShowDto>
    {
        public CreateShowValidator()
        {
            RuleFor(x => x.Title).NotEmpty().WithMessage("Title is required.");
            RuleFor(x => x.Description).NotEmpty().WithMessage("Description is required.");
            RuleFor(x => x.VisualStyle).NotEmpty().WithMessage("VisualStyle is required.");
            RuleFor(x => x.TargetAudience).NotEmpty().WithMessage("TargetAudience is required.");
        }
    }
}
