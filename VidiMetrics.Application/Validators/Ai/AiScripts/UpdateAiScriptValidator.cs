using FluentValidation;
using VidiMetrics.Application.DTOs.Ai.AiScripts;

namespace VidiMetrics.Application.Validators.Ai.AiScripts
{
    public class UpdateAiScriptValidator : AbstractValidator<UpdateAiScriptDto>
    {
        public UpdateAiScriptValidator()
        {
            RuleFor(x => x.LocationId).NotEmpty();
        }
    }
}
