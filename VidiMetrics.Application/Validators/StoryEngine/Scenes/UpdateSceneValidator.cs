using FluentValidation;
using VidiMetrics.Application.DTOs.StoryEngine.Scenes;

namespace VidiMetrics.Application.Validators.StoryEngine.Scenes
{
    public class UpdateSceneValidator : AbstractValidator<UpdateSceneDto>
    {
        public UpdateSceneValidator()
        {
            RuleFor(x => x.Order).GreaterThanOrEqualTo(0);
        }
    }
}
