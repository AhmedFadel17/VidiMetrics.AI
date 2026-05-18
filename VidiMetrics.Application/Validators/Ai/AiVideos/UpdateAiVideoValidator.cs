using FluentValidation;
using VidiMetrics.Application.DTOs.Ai.AiVideos;

namespace VidiMetrics.Application.Validators.Ai.AiVideos
{
    public class UpdateAiVideoValidator : AbstractValidator<UpdateAiVideoDto>
    {
        public UpdateAiVideoValidator()
        {
            RuleFor(x => x.VideoUrl).NotEmpty().When(x => x.VideoUrl != null);
        }
    }
}
