using FluentValidation;
using VidiMetrics.Application.DTOs.StoryEngine.Scenes;

namespace VidiMetrics.Application.Validators.StoryEngine.Scenes
{
    public class CreateSceneValidator : AbstractValidator<CreateSceneDto>
    {
        public CreateSceneValidator()
        {
            RuleFor(x => x.Script).NotEmpty();
            RuleFor(x => x.VisualPrompt).NotEmpty();
            RuleFor(x => x.StoryEnvironmentId).NotEmpty();
            RuleFor(x => x.EpisodeId).NotEmpty();
            RuleFor(x => x.Order).GreaterThanOrEqualTo(0);
        }
    }
}
