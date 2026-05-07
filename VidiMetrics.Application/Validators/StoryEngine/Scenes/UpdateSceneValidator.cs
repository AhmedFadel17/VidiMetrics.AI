using FluentValidation;
using VidiMetrics.Application.DTOs.StoryEngine.Scenes;

namespace VidiMetrics.Application.Validators.StoryEngine.Scenes
{
    public class UpdateSceneValidator : AbstractValidator<UpdateSceneDto>
    {
        public UpdateSceneValidator()
        {
            RuleFor(x => x.Script).NotEmpty();
            RuleFor(x => x.VisualPrompt).NotEmpty();
            RuleFor(x => x.StoryEnvironmentId).NotEmpty();
            RuleFor(x => x.Order).GreaterThanOrEqualTo(0);
        }
    }
}
