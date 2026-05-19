using FluentValidation;
using VidiMetrics.Application.DTOs.StoryEngine.Scenes;

namespace VidiMetrics.Application.Validators.StoryEngine.Scenes
{
    public class UpdateSceneValidator : AbstractValidator<UpdateSceneDto>
    {
        public UpdateSceneValidator()
        {
            RuleFor(x => x.Order).GreaterThanOrEqualTo(0).WithMessage("Order must be greater than or equal to 0.").When(x => x.Order != null);
            RuleFor(x => x.Name).NotEmpty().WithMessage("Name is required.").When(x => !string.IsNullOrEmpty(x.Name));
            RuleFor(x => x.AiVideoId).NotEmpty().WithMessage("AiVideoId is required.").When(x => x.AiVideoId != null);
            RuleFor(x => x.AiScriptId).NotEmpty().WithMessage("AiScriptId is required.").When(x => x.AiScriptId != null);
        }
    }
}
