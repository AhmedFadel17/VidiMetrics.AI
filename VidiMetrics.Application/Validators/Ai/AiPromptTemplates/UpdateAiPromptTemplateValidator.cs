using FluentValidation;
using VidiMetrics.Application.DTOs.Ai.AiPromptTemplates;

namespace VidiMetrics.Application.Validators.Ai.AiPromptTemplates
{
    public class UpdateAiPromptTemplateValidator : AbstractValidator<UpdateAiPromptTemplateDto>
    {
        public UpdateAiPromptTemplateValidator()
        {
            RuleFor(x => x.Name).NotEmpty().WithMessage("Name cannot be empty.").When(x => x.Name != null);
            RuleFor(x => x.SystemPrompt).NotEmpty().WithMessage("SystemPrompt cannot be empty.").When(x => x.SystemPrompt != null);
            RuleFor(x => x.UserPromptTemplate).NotEmpty().WithMessage("UserPromptTemplate cannot be empty.").When(x => x.UserPromptTemplate != null);
            RuleFor(x => x.ModelTarget).NotEmpty().WithMessage("ModelTarget cannot be empty.").When(x => x.ModelTarget != null);
        }
    }
}
