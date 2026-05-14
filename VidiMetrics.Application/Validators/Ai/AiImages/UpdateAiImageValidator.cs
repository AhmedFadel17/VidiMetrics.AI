using FluentValidation;
using VidiMetrics.Application.DTOs.Ai.AiImages;

namespace VidiMetrics.Application.Validators.Ai.AiImages;

public class UpdateAiImageValidator : AbstractValidator<UpdateAiImageDto>
{
    public UpdateAiImageValidator()
    {
        RuleFor(x => x.Prompt).MaximumLength(4000).WithMessage("Prompt cannot be longer than 4000 characters.").When(x => x.Prompt != null);
        RuleFor(x => x.Seed).NotEmpty().WithMessage("Seed is required.").When(x => x.Seed != null);
        RuleFor(x => x.IsLinked).NotEmpty().WithMessage("IsLinked is required.").When(x => x.IsLinked != null);
    }
}
