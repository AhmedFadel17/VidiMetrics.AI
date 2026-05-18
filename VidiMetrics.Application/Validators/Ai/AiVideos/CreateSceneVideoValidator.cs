using FluentValidation;
using VidiMetrics.Application.DTOs.Ai.AiVideos;

namespace VidiMetrics.Application.Validators.Ai.AiVideos
{
    public class CreateSceneVideoValidator : AbstractValidator<CreateSceneVideoDto>
    {
        public CreateSceneVideoValidator()
        {
            RuleFor(x => x.ScriptId).NotEmpty();
        }
    }
}
