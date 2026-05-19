using FluentValidation;
using VidiMetrics.Application.DTOs.Ai.AiImages;

namespace VidiMetrics.Application.Validators.Ai.AiImages;

public class CreateShowImageValidator : AbstractValidator<CreateShowImageDto>
{
    public CreateShowImageValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required.")
            .MaximumLength(250).WithMessage("Title must be less than 250 characters.");


        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Description is required.")
            .MaximumLength(1000).WithMessage("Description must be less than 1000 characters.");


        RuleFor(x => x.VisualStyle)
            .NotEmpty().WithMessage("Visual style is required.")
            .MaximumLength(500).WithMessage("Visual style must be less than 500 characters.");


        RuleFor(x => x.TargetAudience)
            .NotEmpty().WithMessage("Target audience is required.")
            .MaximumLength(500).WithMessage("Target audience must be less than 500 characters.");
    }
}
