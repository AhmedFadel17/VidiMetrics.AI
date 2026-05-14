using FluentValidation;
using VidiMetrics.Application.DTOs.Ai.AiScripts;

namespace VidiMetrics.Application.Validators.Ai.AiScripts
{
    public class CreateAiScriptValidator : AbstractValidator<CreateAiScriptDto>
    {
        public CreateAiScriptValidator()
        {
            RuleFor(x => x.StoryEnvironmentId).NotEmpty();
            RuleFor(x => x.SceneId).NotEmpty();
        }
    }
}
