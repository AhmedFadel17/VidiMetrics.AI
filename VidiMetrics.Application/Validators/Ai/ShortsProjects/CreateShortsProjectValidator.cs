using FluentValidation;
using VidiMetrics.Application.DTOs.Ai.ShortsProjects;

namespace VidiMetrics.Application.Validators.Ai.ShortsProjects
{
    public class CreateShortsProjectValidator : AbstractValidator<CreateShortsProjectDto>
    {
        public CreateShortsProjectValidator()
        {
            RuleFor(x => x.ProjectName).NotEmpty().WithMessage("ProjectName is required.");
            RuleFor(x => x.TargetPlatform).NotEmpty().WithMessage("TargetPlatform is required.");
            RuleFor(x => x.OriginalVideoId).NotEmpty().WithMessage("OriginalVideoId is required.");
        }
    }
}
