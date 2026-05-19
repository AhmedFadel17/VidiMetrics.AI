using FluentValidation;
using VidiMetrics.Application.DTOs.StoryEngine.Shows;

namespace VidiMetrics.Application.Validators.StoryEngine.Shows
{
    public class UpdateShowValidator : AbstractValidator<UpdateShowDto>
    {
        public UpdateShowValidator()
        {
            RuleFor(x => x.Title).NotEmpty().WithMessage("Title cannot be empty.").When(x => x.Title != null);
            RuleFor(x => x.Description).NotEmpty().WithMessage("Description cannot be empty.").When(x => x.Description != null);
            RuleFor(x => x.VisualStyle).NotEmpty().WithMessage("VisualStyle cannot be empty.").When(x => x.VisualStyle != null);
            RuleFor(x => x.TargetAudience).NotEmpty().WithMessage("TargetAudience cannot be empty.").When(x => x.TargetAudience != null);
            RuleFor(x => x.Status).NotEmpty().WithMessage("Status cannot be empty.").When(x => x.Status != null);
            RuleFor(x => x.AiImageId).NotEmpty().WithMessage("AiImageId cannot be empty.").When(x => x.AiImageId != null);
        }
    }
}
