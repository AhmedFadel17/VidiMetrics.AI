using FluentValidation;
using VidiMetrics.Application.DTOs.StoryEngine.Scenes;

namespace VidiMetrics.Application.Validators.StoryEngine.Scenes
{
    public class CreateSceneValidator : AbstractValidator<CreateSceneDto>
    {
        public CreateSceneValidator()
        {
            RuleFor(x => x.EpisodeId).NotEmpty().WithMessage("EpisodeId is required.");
            RuleFor(x => x.Name).NotEmpty().WithMessage("Name is required.");
            RuleFor(x => x.Order).GreaterThanOrEqualTo(0).WithMessage("Order must be greater than or equal to 0.");
        }
    }
}
