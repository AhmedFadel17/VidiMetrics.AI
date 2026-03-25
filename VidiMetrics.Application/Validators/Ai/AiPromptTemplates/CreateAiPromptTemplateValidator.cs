using FluentValidation;
using VidiMetrics.Application.DTOs.Ai.AiPromptTemplates;

namespace VidiMetrics.Application.Validators.Ai.AiPromptTemplates
{
    public class CreateAiPromptTemplateValidator : AbstractValidator<CreateAiPromptTemplateDto>
    {
        public CreateAiPromptTemplateValidator()
        {
            RuleFor(x => x.Name).NotEmpty().WithMessage("Name is required.");
            RuleFor(x => x.SystemPrompt).NotEmpty().WithMessage("SystemPrompt is required.");
            RuleFor(x => x.UserPromptTemplate).NotEmpty().WithMessage("UserPromptTemplate is required.");
            RuleFor(x => x.ModelTarget).NotEmpty().WithMessage("ModelTarget is required.");
        }
    }
}
