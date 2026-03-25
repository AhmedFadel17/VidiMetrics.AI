using FluentValidation;
using VidiMetrics.Application.DTOs.Ai.ShortsProjects;

namespace VidiMetrics.Application.Validators.Ai.ShortsProjects
{
    public class UpdateShortsProjectValidator : AbstractValidator<UpdateShortsProjectDto>
    {
        public UpdateShortsProjectValidator()
        {
            RuleFor(x => x.ProjectName).NotEmpty().WithMessage("ProjectName cannot be empty.").When(x => x.ProjectName != null);
            RuleFor(x => x.TargetPlatform).NotEmpty().WithMessage("TargetPlatform cannot be empty.").When(x => x.TargetPlatform != null);
            RuleFor(x => x.OriginalVideoId).NotEmpty().WithMessage("OriginalVideoId cannot be empty.").When(x => x.OriginalVideoId != null);
        }
    }
}
