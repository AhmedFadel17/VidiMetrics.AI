using FluentValidation;
using VidiMetrics.Application.DTOs.Ai.AiScripts;

namespace VidiMetrics.Application.Validators.Ai.AiScripts
{
    public class CreateAiScriptValidator : AbstractValidator<CreateAiScriptDto>
    {
        public CreateAiScriptValidator()
        {
            RuleFor(x => x.LocationId).NotEmpty();
            RuleFor(x => x.Weather).NotEmpty();
            RuleFor(x => x.EnvironmentDescription).NotEmpty();
            RuleFor(x => x.ScriptLines).NotEmpty().WithMessage("At least one script line is required.");
        }
    }
}
